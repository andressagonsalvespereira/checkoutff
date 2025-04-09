import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tag, Facebook, PlusCircle, Save, AlertCircle, Trash } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import AdminLayout from '@/components/layout/AdminLayout';

// Define types for the pixel settings
interface CustomEvent {
  id: string;
  name: string;
  trigger: string;
  enabled: boolean;
}

interface GooglePixelSettings {
  enabled: boolean;
  tagId: string;
  events: {
    pageView: boolean;
    purchase: boolean;
  };
  customEvents: CustomEvent[];
}

interface FacebookPixelSettings {
  enabled: boolean;
  pixelId: string;
  events: {
    pageView: boolean;
    addToCart: boolean;
    purchase: boolean;
  };
  customEvents: CustomEvent[];
}

interface PixelSettings {
  google: GooglePixelSettings;
  facebook: FacebookPixelSettings;
}

// Default settings
const defaultSettings: PixelSettings = {
  google: {
    enabled: false,
    tagId: '',
    events: {
      pageView: true,
      purchase: true
    },
    customEvents: []
  },
  facebook: {
    enabled: false,
    pixelId: '',
    events: {
      pageView: true,
      addToCart: true,
      purchase: true
    },
    customEvents: []
  }
};

const PixelSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<PixelSettings>(defaultSettings);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    google?: string;
    facebook?: string;
  }>({});
  
  // New custom event fields
  const [newGoogleEvent, setNewGoogleEvent] = useState({ name: '', trigger: '' });
  const [newFacebookEvent, setNewFacebookEvent] = useState({ name: '', trigger: '' });

  // Load saved settings on component mount
  useEffect(() => {
    const loadSettings = () => {
      const savedSettings = localStorage.getItem('pixelSettings');
      if (savedSettings) {
        try {
          const parsedSettings = JSON.parse(savedSettings);
          setSettings(parsedSettings);
        } catch (error) {
          console.error('Error parsing pixel settings:', error);
          toast({
            title: "Erro ao carregar configurações",
            description: "As configurações de pixel não puderam ser carregadas.",
            variant: "destructive",
          });
        }
      }
    };

    loadSettings();
  }, [toast]);

  // Validate Google Tag ID
  const validateGoogleTagId = (tagId: string): boolean => {
    const googleTagPattern = /^GTM-[A-Z0-9]{6,7}$/;
    return googleTagPattern.test(tagId);
  };

  // Validate Facebook Pixel ID
  const validateFacebookPixelId = (pixelId: string): boolean => {
    const facebookPixelPattern = /^\d{15}$/;
    return facebookPixelPattern.test(pixelId);
  };

  // Handle form submission
  const handleSubmit = () => {
    const errors: { google?: string; facebook?: string } = {};

    // Validate Google Tag ID if enabled
    if (settings.google.enabled && settings.google.tagId) {
      if (!validateGoogleTagId(settings.google.tagId)) {
        errors.google = "ID do Google Tag inválido. Formato esperado: GTM-XXXXXX";
      }
    }

    // Validate Facebook Pixel ID if enabled
    if (settings.facebook.enabled && settings.facebook.pixelId) {
      if (!validateFacebookPixelId(settings.facebook.pixelId)) {
        errors.facebook = "ID do Facebook Pixel inválido. Deve ser um número de 15 dígitos.";
      }
    }

    // If there are validation errors, display them and return
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    // Clear any previous validation errors
    setValidationErrors({});

    // In a real application, this would send the data to an API
    // For now, we'll just store it in localStorage
    setLoading(true);
    
    try {
      localStorage.setItem('pixelSettings', JSON.stringify(settings));
      
      toast({
        title: "Configurações salvas",
        description: "As configurações de pixel foram salvas com sucesso.",
      });
    } catch (error) {
      console.error('Error saving pixel settings:', error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar as configurações.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Add a custom event to Google
  const addGoogleCustomEvent = () => {
    if (newGoogleEvent.name && newGoogleEvent.trigger) {
      const newEvent: CustomEvent = {
        id: `google-event-${Date.now()}`,
        name: newGoogleEvent.name,
        trigger: newGoogleEvent.trigger,
        enabled: true
      };
      
      setSettings({
        ...settings,
        google: {
          ...settings.google,
          customEvents: [...settings.google.customEvents, newEvent]
        }
      });
      
      setNewGoogleEvent({ name: '', trigger: '' });
    }
  };

  // Add a custom event to Facebook
  const addFacebookCustomEvent = () => {
    if (newFacebookEvent.name && newFacebookEvent.trigger) {
      const newEvent: CustomEvent = {
        id: `facebook-event-${Date.now()}`,
        name: newFacebookEvent.name,
        trigger: newFacebookEvent.trigger,
        enabled: true
      };
      
      setSettings({
        ...settings,
        facebook: {
          ...settings.facebook,
          customEvents: [...settings.facebook.customEvents, newEvent]
        }
      });
      
      setNewFacebookEvent({ name: '', trigger: '' });
    }
  };

  // Remove a custom event from Google
  const removeGoogleCustomEvent = (eventId: string) => {
    setSettings({
      ...settings,
      google: {
        ...settings.google,
        customEvents: settings.google.customEvents.filter(event => event.id !== eventId)
      }
    });
  };

  // Remove a custom event from Facebook
  const removeFacebookCustomEvent = (eventId: string) => {
    setSettings({
      ...settings,
      facebook: {
        ...settings.facebook,
        customEvents: settings.facebook.customEvents.filter(event => event.id !== eventId)
      }
    });
  };

  // Toggle a custom event status
  const toggleGoogleCustomEvent = (eventId: string) => {
    setSettings({
      ...settings,
      google: {
        ...settings.google,
        customEvents: settings.google.customEvents.map(event => 
          event.id === eventId ? { ...event, enabled: !event.enabled } : event
        )
      }
    });
  };

  const toggleFacebookCustomEvent = (eventId: string) => {
    setSettings({
      ...settings,
      facebook: {
        ...settings.facebook,
        customEvents: settings.facebook.customEvents.map(event => 
          event.id === eventId ? { ...event, enabled: !event.enabled } : event
        )
      }
    });
  };

  return (
    <AdminLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Configuração de Pixels</h1>
        
        <Tabs defaultValue="google" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="google" className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              <span>Google Pixel</span>
            </TabsTrigger>
            <TabsTrigger value="facebook" className="flex items-center gap-2">
              <Facebook className="h-4 w-4" />
              <span>Facebook/Meta Pixel</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Google Pixel Tab */}
          <TabsContent value="google">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Google Pixel (Google Ads/Google Tag Manager)</CardTitle>
                    <CardDescription>
                      Configure o Google Tag Manager para rastrear eventos em seu site
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="googleEnabled">Ativar Pixel</Label>
                    <Switch
                      id="googleEnabled"
                      checked={settings.google.enabled}
                      onCheckedChange={(checked) => 
                        setSettings({
                          ...settings,
                          google: {
                            ...settings.google,
                            enabled: checked
                          }
                        })
                      }
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="googleTagId">Google Tag ID</Label>
                    <div className="mt-1">
                      <Input
                        id="googleTagId"
                        placeholder="GTM-XXXXXX"
                        value={settings.google.tagId}
                        onChange={(e) => 
                          setSettings({
                            ...settings,
                            google: {
                              ...settings.google,
                              tagId: e.target.value
                            }
                          })
                        }
                        className={validationErrors.google ? "border-red-500" : ""}
                      />
                      {validationErrors.google && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.google}</p>
                      )}
                      <p className="text-sm text-gray-500 mt-1">
                        Digite o ID do Google Tag Manager (começa com GTM-)
                      </p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-md font-medium mb-3">Eventos Padrão</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="googlePageView">Page View</Label>
                        <Switch
                          id="googlePageView"
                          checked={settings.google.events.pageView}
                          onCheckedChange={(checked) => 
                            setSettings({
                              ...settings,
                              google: {
                                ...settings.google,
                                events: {
                                  ...settings.google.events,
                                  pageView: checked
                                }
                              }
                            })
                          }
                          disabled={!settings.google.enabled}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="googlePurchase">Purchase</Label>
                        <Switch
                          id="googlePurchase"
                          checked={settings.google.events.purchase}
                          onCheckedChange={(checked) => 
                            setSettings({
                              ...settings,
                              google: {
                                ...settings.google,
                                events: {
                                  ...settings.google.events,
                                  purchase: checked
                                }
                              }
                            })
                          }
                          disabled={!settings.google.enabled}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-md font-medium mb-3">Eventos Personalizados</h3>
                    
                    {settings.google.customEvents.length > 0 ? (
                      <div className="space-y-3 mb-4">
                        {settings.google.customEvents.map((event) => (
                          <div key={event.id} className="flex items-center justify-between p-3 border rounded-md">
                            <div>
                              <p className="font-medium">{event.name}</p>
                              <p className="text-sm text-gray-500">Gatilho: {event.trigger}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={event.enabled}
                                onCheckedChange={() => toggleGoogleCustomEvent(event.id)}
                                disabled={!settings.google.enabled}
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeGoogleCustomEvent(event.id)}
                              >
                                <Trash className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 mb-4">
                        Nenhum evento personalizado configurado.
                      </p>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="newGoogleEventName">Nome do Evento</Label>
                        <Input
                          id="newGoogleEventName"
                          placeholder="ex: lead_form_submit"
                          value={newGoogleEvent.name}
                          onChange={(e) => setNewGoogleEvent({...newGoogleEvent, name: e.target.value})}
                          disabled={!settings.google.enabled}
                        />
                      </div>
                      <div>
                        <Label htmlFor="newGoogleEventTrigger">Gatilho</Label>
                        <Input
                          id="newGoogleEventTrigger"
                          placeholder="ex: click_submit_button"
                          value={newGoogleEvent.trigger}
                          onChange={(e) => setNewGoogleEvent({...newGoogleEvent, trigger: e.target.value})}
                          disabled={!settings.google.enabled}
                        />
                      </div>
                    </div>
                    <Button
                      onClick={addGoogleCustomEvent}
                      className="mt-3"
                      disabled={!newGoogleEvent.name || !newGoogleEvent.trigger || !settings.google.enabled}
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Adicionar Evento
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Facebook Pixel Tab */}
          <TabsContent value="facebook">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Facebook/Meta Pixel</CardTitle>
                    <CardDescription>
                      Configure o Meta Pixel para rastrear eventos e conversões
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="facebookEnabled">Ativar Pixel</Label>
                    <Switch
                      id="facebookEnabled"
                      checked={settings.facebook.enabled}
                      onCheckedChange={(checked) => 
                        setSettings({
                          ...settings,
                          facebook: {
                            ...settings.facebook,
                            enabled: checked
                          }
                        })
                      }
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="facebookPixelId">Meta Pixel ID</Label>
                    <div className="mt-1">
                      <Input
                        id="facebookPixelId"
                        placeholder="123456789012345"
                        value={settings.facebook.pixelId}
                        onChange={(e) => 
                          setSettings({
                            ...settings,
                            facebook: {
                              ...settings.facebook,
                              pixelId: e.target.value
                            }
                          })
                        }
                        className={validationErrors.facebook ? "border-red-500" : ""}
                      />
                      {validationErrors.facebook && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.facebook}</p>
                      )}
                      <p className="text-sm text-gray-500 mt-1">
                        Digite o ID do Meta Pixel (15 dígitos numéricos)
                      </p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-md font-medium mb-3">Eventos Padrão</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="facebookPageView">Page View</Label>
                        <Switch
                          id="facebookPageView"
                          checked={settings.facebook.events.pageView}
                          onCheckedChange={(checked) => 
                            setSettings({
                              ...settings,
                              facebook: {
                                ...settings.facebook,
                                events: {
                                  ...settings.facebook.events,
                                  pageView: checked
                                }
                              }
                            })
                          }
                          disabled={!settings.facebook.enabled}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="facebookAddToCart">Add to Cart</Label>
                        <Switch
                          id="facebookAddToCart"
                          checked={settings.facebook.events.addToCart}
                          onCheckedChange={(checked) => 
                            setSettings({
                              ...settings,
                              facebook: {
                                ...settings.facebook,
                                events: {
                                  ...settings.facebook.events,
                                  addToCart: checked
                                }
                              }
                            })
                          }
                          disabled={!settings.facebook.enabled}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="facebookPurchase">Purchase</Label>
                        <Switch
                          id="facebookPurchase"
                          checked={settings.facebook.events.purchase}
                          onCheckedChange={(checked) => 
                            setSettings({
                              ...settings,
                              facebook: {
                                ...settings.facebook,
                                events: {
                                  ...settings.facebook.events,
                                  purchase: checked
                                }
                              }
                            })
                          }
                          disabled={!settings.facebook.enabled}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-md font-medium mb-3">Eventos Personalizados</h3>
                    
                    {settings.facebook.customEvents.length > 0 ? (
                      <div className="space-y-3 mb-4">
                        {settings.facebook.customEvents.map((event) => (
                          <div key={event.id} className="flex items-center justify-between p-3 border rounded-md">
                            <div>
                              <p className="font-medium">{event.name}</p>
                              <p className="text-sm text-gray-500">Gatilho: {event.trigger}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={event.enabled}
                                onCheckedChange={() => toggleFacebookCustomEvent(event.id)}
                                disabled={!settings.facebook.enabled}
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFacebookCustomEvent(event.id)}
                              >
                                <Trash className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 mb-4">
                        Nenhum evento personalizado configurado.
                      </p>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="newFacebookEventName">Nome do Evento</Label>
                        <Input
                          id="newFacebookEventName"
                          placeholder="ex: CompleteRegistration"
                          value={newFacebookEvent.name}
                          onChange={(e) => setNewFacebookEvent({...newFacebookEvent, name: e.target.value})}
                          disabled={!settings.facebook.enabled}
                        />
                      </div>
                      <div>
                        <Label htmlFor="newFacebookEventTrigger">Gatilho</Label>
                        <Input
                          id="newFacebookEventTrigger"
                          placeholder="ex: form_submit"
                          value={newFacebookEvent.trigger}
                          onChange={(e) => setNewFacebookEvent({...newFacebookEvent, trigger: e.target.value})}
                          disabled={!settings.facebook.enabled}
                        />
                      </div>
                    </div>
                    <Button
                      onClick={addFacebookCustomEvent}
                      className="mt-3"
                      disabled={!newFacebookEvent.name || !newFacebookEvent.trigger || !settings.facebook.enabled}
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Adicionar Evento
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 flex justify-end">
          <Button 
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700"
            disabled={loading}
          >
            {loading ? (
              <>
                <AlertCircle className="h-4 w-4 mr-2 animate-pulse" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Salvar Configurações
              </>
            )}
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default PixelSettings;
