import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, FileText, AlertTriangle, Crown, Scale, Shield, Users, Zap, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
const TermsOfService = () => {
  const navigate = useNavigate();
  return <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <header className="border-b border-slate-200/60 backdrop-blur-xl transition-all duration-300 sticky top-0 z-40 bg-white/95">
        <div className="max-w-4xl mx-auto py-[13px] px-0">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="flex items-center gap-2 hover:bg-red-50 hover:text-red-600">
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-red-600" />
              <h1 className="text-xl font-bold text-slate-800">Termos de Uso</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-0 px-0">
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
            <CardTitle className="text-3xl font-bold mb-2">
              Termos de Uso
            </CardTitle>
            <p className="text-blue-100 text-lg">
              SB2coach.ai - Condições de uso do serviço
            </p>
            <p className="text-blue-200 text-sm mt-2">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </CardHeader>
          
          <CardContent className="p-8 space-y-10 py-0 px-0">
            {/* Introdução */}
            <section className="text-center">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 px-0">
                <AlertTriangle className="w-8 h-8 text-amber-600 mx-auto mb-3" />
                <p className="text-slate-700 text-lg leading-relaxed">
                  Ao usar o <strong>SB2coach.ai</strong>, você concorda com estes Termos de Uso. 
                  Leia atentamente antes de utilizar nossa plataforma de coaching inteligente.
                </p>
              </div>
            </section>

            <Separator className="my-8" />

            {/* Seção 1 - Aceitação */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 text-center">
                  1. Aceitação dos Termos
                </h2>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-6 py-[23px] px-0">
                <p className="text-slate-700 text-lg leading-relaxed px-[4px]">
                  Ao acessar e usar o SB2coach.ai, você automaticamente concorda em cumprir 
                  estes Termos de Uso e nossa Política de Privacidade. Se não concordar com 
                  qualquer parte destes termos, você não deve usar nosso serviço.
                </p>
              </div>
            </section>

            <Separator className="my-8" />

            {/* Seção 2 - Descrição do Serviço */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Zap className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">
                  2. Descrição do Serviço
                </h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border border-slate-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-6 px-[4px]">
                    <h3 className="font-semibold text-lg text-slate-800 mb-3">
                      Recursos Principais
                    </h3>
                    <ul className="space-y-2 text-slate-700">
                      <li>• Coaching personalizado de emagrecimento</li>
                      <li>• Análise calórica por IA com fotos</li>
                      <li>• Timer de jejum intermitente</li>
                      <li>• Controle inteligente de suplementos</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border border-slate-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-6 px-[4px]">
                    <h3 className="font-semibold text-lg text-slate-800 mb-3">
                      Funcionalidades Avançadas
                    </h3>
                    <ul className="space-y-2 text-slate-700">
                      <li>• Estatísticas detalhadas e gamificação</li>
                      <li>• IA Coach para orientação contínua</li>
                      <li>• Sistema de conquistas e recompensas</li>
                      <li>• Acompanhamento de progresso</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            <Separator className="my-8" />

            {/* Seção 3 - Limitações Importantes */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">
                  3. Limitações e Responsabilidades
                </h2>
              </div>
              
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 px-[4px]">
                <div className="flex items-center gap-3 mb-4 px-[20px]">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                  <p className="text-xl font-bold text-red-800">
                    AVISO MÉDICO IMPORTANTE
                  </p>
                </div>
                <div className="space-y-4">
                  <p className="text-slate-700 text-lg">
                    O <strong>SB2coach.ai é uma ferramenta de apoio</strong> e não substitui 
                    orientação médica profissional.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-red-800 mb-2">⚠️ Você deve:</h4>
                      <ul className="space-y-1 text-slate-700">
                        <li>• Consultar um médico antes de começar</li>
                        <li>• Verificar se é seguro para sua saúde</li>
                        <li>• Seguir orientações médicas prioritariamente</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-800 mb-2">❌ Não somos responsáveis por:</h4>
                      <ul className="space-y-1 text-slate-700">
                        <li>• Decisões baseadas apenas no app</li>
                        <li>• Problemas de saúde decorrentes</li>
                        <li>• Estimativas imprecisas de calorias</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <Separator className="my-8" />

            {/* Seção 4 - Conta de Usuário */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">
                  4. Sua Conta de Usuário
                </h2>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-6 px-[4px]">
                <h3 className="font-semibold text-lg text-slate-800 mb-4">
                  Requisitos e Responsabilidades:
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-purple-800 mb-3">✅ Você deve:</h4>
                    <ul className="space-y-2 text-slate-700">
                      <li>• Ter pelo menos 18 anos</li>
                      <li>• Fornecer informações verdadeiras</li>
                      <li>• Manter dados sempre atualizados</li>
                      <li>• Proteger sua senha e login</li>
                      <li>• Usar apenas sua própria conta</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-purple-800 mb-3">🚫 Você não deve:</h4>
                    <ul className="space-y-2 text-slate-700">
                      <li>• Compartilhar credenciais</li>
                      <li>• Criar múltiplas contas</li>
                      <li>• Usar informações falsas</li>
                      <li>• Permitir uso por terceiros</li>
                      <li>• Violar políticas de uso</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <Separator className="my-8" />

            {/* Seção 5 - Assinatura Premium */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Crown className="w-6 h-6 text-yellow-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">
                  5. SB2 Turbo - Assinatura Premium
                </h2>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6 px-[4px]">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-lg text-slate-800 mb-3 flex items-center gap-2">
                      <Crown className="w-5 h-5 text-yellow-600" />
                      Recursos Premium
                    </h3>
                    <ul className="space-y-2 text-slate-700">
                      <li>• Análises ilimitadas de fotos</li>
                      <li>• IA Coach com recursos avançados</li>
                      <li>• Estatísticas detalhadas e insights</li>
                      <li>• Suporte prioritário</li>
                      <li>• Recursos exclusivos de gamificação</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-slate-800 mb-3 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-green-600" />
                      Política de Reembolso
                    </h3>
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-slate-700 mb-2">
                        <strong>7 dias de garantia:</strong>
                      </p>
                      <p className="text-sm text-slate-600">
                        Cancelamentos podem ser solicitados em até 7 dias após a compra, 
                        conforme nossa política de reembolso.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <Separator className="my-8" />

            {/* Seção 6 - Uso Aceitável */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Shield className="w-6 h-6 text-indigo-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">
                  6. Política de Uso Aceitável
                </h2>
              </div>
              
              <div className="bg-indigo-50 rounded-lg p-6 px-[4px]">
                <p className="text-slate-700 text-lg mb-4">
                  Para manter um ambiente seguro e respeitoso, você concorda em <strong>NÃO:</strong>
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-indigo-800 mb-3">🚫 Atividades Proibidas:</h4>
                    <ul className="space-y-2 text-slate-700">
                      <li>• Usar para fins ilegais ou prejudiciais</li>
                      <li>• Tentar hackear ou comprometer segurança</li>
                      <li>• Fazer engenharia reversa do software</li>
                      <li>• Usar bots ou scripts automatizados</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-indigo-800 mb-3">❌ Conteúdo Inadequado:</h4>
                    <ul className="space-y-2 text-slate-700">
                      <li>• Compartilhar conteúdo ofensivo</li>
                      <li>• Revender ou redistribuir serviços</li>
                      <li>• Violar direitos de terceiros</li>
                      <li>• Spam ou comportamento abusivo</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <Separator className="my-8" />

            {/* Seção 7 - Lei Aplicável */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Scale className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">
                  7. Lei Aplicável e Jurisdição
                </h2>
              </div>
              
              <div className="bg-green-50 rounded-lg p-6 px-[4px]">
                <div className="flex items-center gap-3 mb-4">
                  <Scale className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-lg font-semibold text-green-800">
                      Legislação Brasileira
                    </p>
                    <p className="text-green-700">
                      Estes termos são regidos pelas leis do Brasil
                    </p>
                  </div>
                </div>
                <p className="text-slate-700">
                  Disputas serão resolvidas nos tribunais competentes do Brasil, 
                  respeitando sempre seus direitos como consumidor conforme o 
                  Código de Defesa do Consumidor.
                </p>
              </div>
            </section>

            <Separator className="my-8" />

            {/* Seção 8 - Contato e Suporte */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-red-100 rounded-lg">
                  <HelpCircle className="w-6 h-6 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">
                  8. Contato e Suporte
                </h2>
              </div>
              
              <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-6 px-[4px]">
                <p className="text-slate-700 mb-4 text-lg">
                  Precisa de ajuda ou tem dúvidas sobre estes termos?
                </p>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <HelpCircle className="w-5 h-5 text-red-600" />
                      <div>
                        <p className="font-semibold text-slate-800">Email de Suporte:</p>
                        <p className="text-slate-700">contato@sb2coach.ai</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-red-600" />
                      <div>
                        <p className="font-semibold text-slate-800">Suporte no App:</p>
                        <p className="text-slate-700">Menu → Suporte</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <Separator className="my-8" />

            {/* Footer dos Termos */}
            <section className="text-center">
              <div className="bg-slate-100 rounded-lg p-6 px-[4px]">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">
                  Alterações nos Termos
                </h3>
                <p className="text-slate-700 mb-4">
                  Podemos modificar estes termos ocasionalmente para refletir mudanças em 
                  nossos serviços ou na legislação.
                </p>
                <div className="bg-white rounded-lg p-3 inline-block">
                  <p className="text-sm text-slate-600">
                    <strong>Importante:</strong> Alterações significativas serão comunicadas 
                    com antecedência por email ou notificação no app.
                  </p>
                </div>
              </div>
            </section>
          </CardContent>
        </Card>
      </main>
    </div>;
};
export default TermsOfService;