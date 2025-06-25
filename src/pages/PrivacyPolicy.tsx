
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Shield, Eye, Database, Phone, Mail, Lock, Users, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <header className="border-b border-slate-200/60 backdrop-blur-xl transition-all duration-300 sticky top-0 z-40 bg-white/95">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 hover:bg-red-50 hover:text-red-600"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-red-600" />
              <h1 className="text-xl font-bold text-slate-800">Política de Privacidade</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center bg-gradient-to-r from-red-500 to-red-600 text-white rounded-t-lg">
            <CardTitle className="text-3xl font-bold mb-2">
              Política de Privacidade
            </CardTitle>
            <p className="text-red-100 text-lg">
              SB2coach.ai - Sua privacidade é nossa prioridade
            </p>
            <p className="text-red-200 text-sm mt-2">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </CardHeader>
          
          <CardContent className="p-8 space-y-10">
            {/* Introdução */}
            <section className="text-center">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <AlertCircle className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <p className="text-slate-700 text-lg leading-relaxed">
                  Esta Política de Privacidade descreve como o <strong>SB2coach.ai</strong> coleta, 
                  usa e protege suas informações pessoais. Leia atentamente para entender 
                  nossos compromissos com sua privacidade.
                </p>
              </div>
            </section>

            <Separator className="my-8" />

            {/* Seção 1 - Informações Coletadas */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Eye className="w-6 h-6 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">
                  1. Informações que Coletamos
                </h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border border-slate-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg text-slate-800 mb-3 flex items-center gap-2">
                      <Users className="w-5 h-5 text-blue-600" />
                      Dados Pessoais
                    </h3>
                    <ul className="space-y-2 text-slate-700">
                      <li>• Nome completo</li>
                      <li>• Endereço de email</li>
                      <li>• Número de telefone</li>
                      <li>• Data de nascimento</li>
                      <li>• Foto de perfil (opcional)</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border border-slate-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg text-slate-800 mb-3 flex items-center gap-2">
                      <Database className="w-5 h-5 text-green-600" />
                      Dados de Saúde
                    </h3>
                    <ul className="space-y-2 text-slate-700">
                      <li>• Peso atual e objetivo</li>
                      <li>• Altura e idade</li>
                      <li>• Informações sobre jejum</li>
                      <li>• Dados de suplementação</li>
                      <li>• Fotos de alimentos</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border border-slate-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg text-slate-800 mb-3 flex items-center gap-2">
                      <Phone className="w-5 h-5 text-purple-600" />
                      Dados de Uso
                    </h3>
                    <ul className="space-y-2 text-slate-700">
                      <li>• Interações com o app</li>
                      <li>• Estatísticas de progresso</li>
                      <li>• Preferências e configurações</li>
                      <li>• Logs de atividade</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border border-slate-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg text-slate-800 mb-3 flex items-center gap-2">
                      <Lock className="w-5 h-5 text-orange-600" />
                      Dados Técnicos
                    </h3>
                    <ul className="space-y-2 text-slate-700">
                      <li>• Endereço IP</li>
                      <li>• Tipo de dispositivo</li>
                      <li>• Navegador utilizado</li>
                      <li>• Sistema operacional</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            <Separator className="my-8" />

            {/* Seção 2 - Como Usamos */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Database className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">
                  2. Como Usamos suas Informações
                </h2>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-lg text-slate-800 mb-3">
                      Personalização do Serviço
                    </h3>
                    <ul className="space-y-2 text-slate-700">
                      <li>✓ Criar planos personalizados de emagrecimento</li>
                      <li>✓ Adaptar recomendações às suas necessidades</li>
                      <li>✓ Configurar lembretes e notificações</li>
                      <li>✓ Analisar seu progresso e evolução</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-slate-800 mb-3">
                      Melhoria do Produto
                    </h3>
                    <ul className="space-y-2 text-slate-700">
                      <li>✓ Aprimorar algoritmos de IA</li>
                      <li>✓ Desenvolver novos recursos</li>
                      <li>✓ Corrigir bugs e problemas</li>
                      <li>✓ Otimizar performance do app</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <Separator className="my-8" />

            {/* Seção 3 - Compartilhamento */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">
                  3. Compartilhamento de Dados
                </h2>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-8 h-8 text-green-600" />
                  <p className="text-xl font-semibold text-green-800">
                    NÃO VENDEMOS SEUS DADOS PESSOAIS
                  </p>
                </div>
                <p className="text-slate-700 mb-4">
                  Seus dados podem ser compartilhados apenas nas seguintes situações:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="font-medium text-slate-800">✓ Com seu consentimento explícito</p>
                    <p className="font-medium text-slate-800">✓ Por determinação legal</p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium text-slate-800">✓ Com prestadores de serviços seguros</p>
                    <p className="font-medium text-slate-800">✓ Em caso de fusão empresarial</p>
                  </div>
                </div>
              </div>
            </section>

            <Separator className="my-8" />

            {/* Seção 4 - Seus Direitos LGPD */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">
                  4. Seus Direitos pela LGPD
                </h2>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-6">
                <p className="text-slate-700 mb-6 text-lg">
                  Conforme a Lei Geral de Proteção de Dados (LGPD), você possui os seguintes direitos:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                      <p className="text-slate-700"><strong>Acesso:</strong> Saber quais dados temos sobre você</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                      <p className="text-slate-700"><strong>Correção:</strong> Corrigir dados incorretos</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                      <p className="text-slate-700"><strong>Exclusão:</strong> Solicitar remoção dos dados</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                      <p className="text-slate-700"><strong>Portabilidade:</strong> Transferir dados para outro serviço</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                      <p className="text-slate-700"><strong>Revogação:</strong> Revogar consentimento</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                      <p className="text-slate-700"><strong>Informação:</strong> Saber com quem compartilhamos</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <Separator className="my-8" />

            {/* Seção 5 - Segurança */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Lock className="w-6 h-6 text-orange-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">
                  5. Segurança e Proteção
                </h2>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4">
                <Card className="border border-orange-200 bg-orange-50/50">
                  <CardContent className="p-4 text-center">
                    <Lock className="w-8 h-8 text-orange-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-slate-800 mb-2">Criptografia</h3>
                    <p className="text-sm text-slate-600">Dados protegidos com criptografia de ponta</p>
                  </CardContent>
                </Card>
                
                <Card className="border border-orange-200 bg-orange-50/50">
                  <CardContent className="p-4 text-center">
                    <Shield className="w-8 h-8 text-orange-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-slate-800 mb-2">Autenticação</h3>
                    <p className="text-sm text-slate-600">Login seguro com Google OAuth</p>
                  </CardContent>
                </Card>
                
                <Card className="border border-orange-200 bg-orange-50/50">
                  <CardContent className="p-4 text-center">
                    <Database className="w-8 h-8 text-orange-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-slate-800 mb-2">Infraestrutura</h3>
                    <p className="text-sm text-slate-600">Servidores seguros na Supabase</p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <Separator className="my-8" />

            {/* Seção 6 - Contato */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Mail className="w-6 h-6 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">
                  6. Entre em Contato
                </h2>
              </div>
              
              <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-6">
                <p className="text-slate-700 mb-4 text-lg">
                  Para exercer seus direitos ou esclarecer dúvidas sobre esta política:
                </p>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <Mail className="w-5 h-5 text-red-600" />
                    <p className="font-semibold text-slate-800">Email:</p>
                    <p className="text-slate-700">contato@sb2coach.ai</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-red-600" />
                    <p className="font-semibold text-slate-800">Responsável:</p>
                    <p className="text-slate-700">Equipe de Proteção de Dados SB2coach.ai</p>
                  </div>
                </div>
              </div>
            </section>

            <Separator className="my-8" />

            {/* Footer da Política */}
            <section className="text-center">
              <div className="bg-slate-100 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">
                  Alterações nesta Política
                </h3>
                <p className="text-slate-700">
                  Esta política pode ser atualizada ocasionalmente. Mudanças significativas serão 
                  comunicadas por email ou notificação no app. O uso continuado após as alterações 
                  constitui aceitação dos novos termos.
                </p>
              </div>
            </section>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
