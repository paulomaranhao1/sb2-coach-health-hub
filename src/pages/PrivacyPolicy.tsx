
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Shield, Eye, Database, Phone, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PrivacyPolicy = () => {
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
              <Shield className="w-6 h-6 text-red-600" />
              <h1 className="text-xl font-bold text-slate-800">Política de Privacidade</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-red-600 mb-2">
              Política de Privacidade - SB2coach.ai
            </CardTitle>
            <p className="text-slate-600">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </CardHeader>
          
          <CardContent className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-red-600" />
                1. Informações que Coletamos
              </h2>
              <div className="space-y-4 text-slate-700">
                <p>
                  O SB2coach.ai coleta as seguintes informações para fornecer nossos serviços de coaching inteligente:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Dados Pessoais:</strong> Nome, email, telefone fornecidos durante o cadastro</li>
                  <li><strong>Dados Biométricos:</strong> Peso, altura, idade, peso objetivo para personalização</li>
                  <li><strong>Dados de Uso:</strong> Interações com o app, progresso, estatísticas de jejum</li>
                  <li><strong>Dados de Saúde:</strong> Informações sobre suplementação e hábitos alimentares</li>
                  <li><strong>Imagens:</strong> Fotos de alimentos para análise calórica (processadas e não armazenadas)</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Database className="w-5 h-5 text-red-600" />
                2. Como Usamos suas Informações
              </h2>
              <div className="space-y-4 text-slate-700">
                <p>Utilizamos suas informações para:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Personalizar seu plano de emagrecimento e coaching</li>
                  <li>Fornecer análises e estatísticas de progresso</li>
                  <li>Enviar lembretes e notificações personalizadas</li>
                  <li>Melhorar nossos algoritmos de IA coaching</li>
                  <li>Comunicar atualizações importantes do serviço</li>
                  <li>Processar pagamentos de assinaturas premium</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-800 mb-4">
                3. Compartilhamento de Dados
              </h2>
              <div className="space-y-4 text-slate-700">
                <p>
                  <strong>Não vendemos ou alugamos seus dados pessoais.</strong> Podemos compartilhar informações apenas:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Com seu consentimento explícito</li>
                  <li>Para cumprir obrigações legais</li>
                  <li>Com provedores de serviços essenciais (Supabase, OpenAI) sob acordos rígidos</li>
                  <li>Em caso de fusão ou aquisição da empresa</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-800 mb-4">
                4. Seus Direitos (LGPD)
              </h2>
              <div className="space-y-4 text-slate-700">
                <p>Conforme a Lei Geral de Proteção de Dados, você tem direito a:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Saber quais dados pessoais temos sobre você</li>
                  <li>Solicitar correção de dados incorretos</li>
                  <li>Solicitar exclusão de seus dados</li>
                  <li>Revogar consentimento a qualquer momento</li>
                  <li>Portabilidade de dados para outro serviço</li>
                  <li>Informações sobre com quem compartilhamos seus dados</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-800 mb-4">
                5. Segurança e Armazenamento
              </h2>
              <div className="space-y-4 text-slate-700">
                <p>
                  Implementamos medidas técnicas e organizacionais para proteger seus dados:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Criptografia de dados em trânsito e em repouso</li>
                  <li>Autenticação segura com Google OAuth</li>
                  <li>Servidores em infraestrutura confiável (Supabase)</li>
                  <li>Acesso restrito aos dados por nossa equipe</li>
                  <li>Backups seguros e regulares</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-800 mb-4">
                6. Cookies e Tecnologias Similares
              </h2>
              <div className="space-y-4 text-slate-700">
                <p>
                  Utilizamos cookies essenciais para funcionamento do app e localStorage para:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Manter sua sessão ativa</li>
                  <li>Salvar preferências e configurações</li>
                  <li>Melhorar a experiência do usuário</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5 text-red-600" />
                7. Contato
              </h2>
              <div className="space-y-4 text-slate-700">
                <p>
                  Para exercer seus direitos ou esclarecer dúvidas sobre esta política:
                </p>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p><strong>Email:</strong> contato@sb2coach.ai</p>
                  <p><strong>Responsável pela Proteção de Dados:</strong> Equipe SB2coach.ai</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-800 mb-4">
                8. Alterações nesta Política
              </h2>
              <div className="space-y-4 text-slate-700">
                <p>
                  Podemos atualizar esta política ocasionalmente. Mudanças significativas serão comunicadas 
                  por email ou notificação no app. O uso continuado após as alterações constitui aceitação 
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

export default PrivacyPolicy;
