
import { z } from 'zod';

export const formSchema = z.object({
  header_message: z.string().min(1, "A mensagem do cabeçalho é obrigatória"),
  banner_image_url: z.string().optional(),
  show_banner: z.boolean(),
  button_color: z.string().min(1, "A cor do botão é obrigatória"),
  button_text_color: z.string().min(1, "A cor do texto do botão é obrigatória"),
  heading_color: z.string().min(1, "A cor dos títulos é obrigatória"),
  button_text: z.string().min(1, "O texto do botão é obrigatório"),
});

export type FormValues = z.infer<typeof formSchema>;
