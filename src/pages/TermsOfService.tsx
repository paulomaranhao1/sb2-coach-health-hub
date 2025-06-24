
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText, AlertTriangle, Crown, Scale } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TermsOfService = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-slate-200/60 backdrop-blur-xl transition-all duration-300 sticky top-0 z-40 bg-white/90">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
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

      <main className="max-w-4xl mx-auto px-4 py-8">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-red-600 mb-2">
              Termos de Uso - SB2coach.ai
            </CardTitle>
            <p className="text-slate-600">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </CardHeader>
          
          <CardContent className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-slate-800 mb-4">
                1. Aceitação dos Termos
              </h2>
              <div className="space-y-4 text-slate-700">
                <p>
                  Ao acessar e usar o SB2coach.ai, você concorda em cumprir estes Termos de Uso. 
                  Se não concordar com qualquer parte destes termos, não use nosso serviço.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-800 mb-4">
                2. Descrição do Serviço
              </h2>
              <div className="space-y-4 text-slate-700">
                <p>
                  O SB2coach.ai é uma plataforma de coaching inteligente que oferece:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Acompanhamento personalizado de emagrecimento</li>
                  <li>Análise calórica por foto com IA</li>
                  <li>Timer de jejum intermitente</li>
                  <li>Controle de suplementação</li>
                  <li>Estatísticas e gamificação</li>
                  <li>Coach de IA para orientação</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                3. Limitações e Responsabilidades
              </h2>
              <div className="space-y-4 text-slate-700">
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                  <p><strong>IMPORTANTE:</strong> O SB2coach.ai é uma ferramenta de apoio e não substitui orientação médica profissional.</p>
                </div>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Consulte um médico antes de iniciar qualquer programa de emagrecimento</li>
                  <li>As análises calóricas são estimativas baseadas em IA</li>
                  <li>Não somos responsáveis por decisões baseadas apenas em nossas orientações</li>
                  <li>Em caso de problemas de saúde, procure ajuda médica imediatamente</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-800 mb-4">
                4. Conta de Usuário
              </h2>
              <div className="space-y-4 text-slate-700">
                <p>Para usar nossos serviços, você deve:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Ter pelo menos 18 anos ou consentimento dos pais</li>
                  <li>Fornecer informações precisas e atualizadas</li>
                  <li>Manter a segurança de sua conta</li>
                  <li>Não compartilhar credenciais com terceiros</li>
                  <li>Nos notificar sobre uso não autorizado</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Crown className="w-5 h-5 text-yellow-600" />
                5. Assinatura Premium
              </h2>
              <div className="space-y-4 text-slate-700">
                <p>
                  O SB2 Turbo (versão premium) oferece recursos avançados mediante pagamento:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Análises ilimitadas de fotos</li>
                  <li>Recursos avançados de IA</li>
                  <li>Estatísticas detalhadas</li>
                  <li>Suporte prioritário</li>
                </ul>
                <p>
                  <strong>Política de Reembolso:</strong> Cancelamentos podem ser solicitados em até 7 dias 
                  após a compra, conforme nossa política de reembolso.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-800 mb-4">
                6. Uso Aceitável
              </h2>
              <div className="space-y-4 text-slate-700">
                <p>Você concorda em NÃO:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Usar o serviço para fins ilegais</li>
                  <li>Tentar hackear ou comprometer a segurança</li>
                  <li>Compartilhar conteúdo ofensivo ou inadequado</li>
                  <li>Fazer engenharia reversa do software</li>
                  <li>Usar bots ou scripts automatizados</li>
                  <li>Revender ou redistribuir nossos serviços</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-800 mb-4">
                7. Propriedade Intelectual
              </h2>
              <div className="space-y-4 text-slate-700">
                <p>
                  Todos os direitos de propriedade intelectual do SB2coach.ai pertencem a nós, incluindo:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Código-fonte e algoritmos</li>
                  <li>Design e interface</li>
                  <li>Marca e logotipos</li>
                  <li>Conteúdo educacional</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-800 mb-4">
                8. Encerramento da Conta
              </h2>
              <div className="space-y-4 text-slate-700">
                <p>
                  Podemos encerrar sua conta se:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Violar estes termos de uso</li>
                  <li>Usar o serviço de forma inadequada</li>
                  <li>Não pagar assinaturas devidas</li>
                  <li>Por solicitação sua</li>
                </ul>
                <p>
                  Você pode cancelar sua conta a qualquer momento através das configurações do app.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Scale className="w-5 h-5 text-red-600" />
                9. Lei Aplicável
              </h2>
              <div className="space-y-4 text-slate-700">
                <p>
                  Estes termos são regidos pelas leis brasileiras. Disputas serão resolvidas nos 
                  tribunais competentes do Brasil.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-800 mb-4">
                10. Contato
              </h2>
              <div className="space-y-4 text-slate-700">
                <p>
                  Para dúvidas sobre estes termos:
                </p>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p><strong>Email:</strong> contato@sb2coach.ai</p>
                  <p><strong>Suporte:</strong> Disponível no menu do aplicativo</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-800 mb-4">
                11. Alterações nos Termos
              </h2>
              <div className="space-y-4 text-slate-700">
                <p>
                  Podemos modificar estes termos ocasionalmente. Alterações significativas serão 
                  comunicadas com antecedência. O uso continuado após mudanças constitui aceitação 
                  dos novos termos.
                </p>
              </div>
            </section>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default TermsOfService;
