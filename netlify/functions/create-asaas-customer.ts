import { Handler } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";
import fetch from "node-fetch";

// Variáveis de ambiente (configure no painel da Netlify)
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const ASAAS_API_KEY = process.env.ASAAS_API_KEY!;
const ASAAS_API_URL = "https://www.asaas.com/api/v3";

export const handler: Handler = async (event) => {
  try {
    if (!event.body) {
      console.error("Corpo da requisição ausente");
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Corpo da requisição ausente" }),
      };
    }

    const data = JSON.parse(event.body);
    const { orderId, customer, product } = data;

    console.log("Recebido:", { orderId, customer, product });

    if (
      !orderId ||
      !customer?.name ||
      !customer?.email ||
      !customer?.cpfCnpj ||
      !customer?.phone ||
      !product?.name ||
      !product?.price
    ) {
      console.error("Dados do cliente ou orderId incompletos", data);
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Dados do cliente ou orderId incompletos",
          detalhes: { orderId, customer, product },
        }),
      };
    }

    // Criação do cliente Asaas
    const customerResponse = await fetch(`${ASAAS_API_URL}/customers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        access_token: ASAAS_API_KEY,
      },
      body: JSON.stringify({
        name: customer.name,
        email: customer.email,
        cpfCnpj: customer.cpfCnpj,
        phone: customer.phone,
      }),
    });

    const customerData = await customerResponse.json();

    if (!customerResponse.ok) {
      console.error("Erro ao criar cliente no Asaas:", customerData);
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Erro ao criar cliente no Asaas",
          detalhes: customerData,
        }),
      };
    }

    console.log("Cliente criado no Asaas:", customerData);

    // Criação da cobrança
    const paymentResponse = await fetch(`${ASAAS_API_URL}/payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        access_token: ASAAS_API_KEY,
      },
      body: JSON.stringify({
        customer: customerData.id,
        billingType: "PIX",
        value: product.price,
        description: product.name,
        dueDate: new Date().toISOString().split("T")[0], // hoje
      }),
    });

    const payment = await paymentResponse.json();

    if (!paymentResponse.ok) {
      console.error("Erro ao criar cobrança PIX:", payment);
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Erro ao criar cobrança no Asaas",
          detalhes: payment,
        }),
      };
    }

    console.log("Cobrança criada:", payment);

    // Gerar o QR Code do pagamento
    const qrCodeResponse = await fetch(
      `${ASAAS_API_URL}/payments/${payment.id}/pixQrCode`,
      {
        method: "GET",
        headers: {
          access_token: ASAAS_API_KEY,
        },
      }
    );

    const qrCode = await qrCodeResponse.json();

    if (!qrCodeResponse.ok) {
      console.error("Erro ao gerar QR Code PIX:", qrCode);
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Erro ao gerar QR Code PIX",
          detalhes: qrCode,
        }),
      };
    }

    console.log("QR Code gerado:", qrCode);

    // Salvar no Supabase
    const { error: insertError } = await supabase
      .from("asaas_payments")
      .insert({
        order_id: orderId,
        payment_id: payment.id,
        status: payment.status,
        amount: payment.value,
        qr_code: qrCode.payload,
        qr_code_image: qrCode.encodedImage,
      });

    if (insertError) {
      console.error("Erro ao salvar no Supabase:", insertError);
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Erro ao salvar pagamento no Supabase",
          detalhes: insertError.message,
        }),
      };
    }

    console.log("Pagamento salvo no Supabase com sucesso!");

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        paymentId: payment.id,
        qrCode: qrCode.payload,
        qrCodeImage: qrCode.encodedImage,
      }),
    };
  } catch (err: any) {
    console.error("Erro inesperado no servidor:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Erro inesperado no servidor",
        detalhes: err.message,
      }),
    };
  }
};
