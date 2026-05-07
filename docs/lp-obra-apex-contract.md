# Contrato Cadastro Sua Obra (lpObraFormulario) e Apex

Este documento descreve o que o LWC `lpObraFormulario` envia hoje, como interpreta o retorno de forma defensiva e o que o time Salesforce deve validar ou evoluir. Não há classes Apex neste repositório; a integração atual chama `LpSejaUmFranqueadoService.upsertLead` como gateway transitório.

## Gateway

- **Hoje:** `LpSejaUmFranqueadoService.upsertLead` com parâmetro `lead` = JSON stringificado do payload abaixo.
- **Desejável:** método dedicado (ex.: `LpObraService.submitLead`) recebendo o mesmo contrato ou um envelope estável (`payloadJson`), com validação, Owner resolvido no servidor e retorno padronizado.

## Query string e contexto de indicação

| Parâmetro URL | Uso no LWC |
|---------------|------------|
| `ref` | Primeira fonte de `referralToken`; com `storeRef` ausente, `storeRef` no payload passa a espelhar o mesmo valor (para analytics/payload não ficarem vazios). |
| `storeRef` | Valor explícito da URL quando presente; caso contrário, igual a `referralToken` (ex.: URL só com `?ref=…`). |
| `referralToken` | `ref` ou, se ausente, `storeRef`. |
| `lojaIndicadora` | Espelha `referralToken`. |

**TODO Salesforce:** confirmar se `storeRef` e `referralToken` devem divergir em algum cenário (ex.: token opaco em `ref` e código de loja em `storeRef`) e ajustar o LWC ou o Apex conforme a regra de negócio.

**Prevalência referralToken vs CEP:** a decisão de qual loja guia prevalece (token de indicação vs. região derivada do CEP) deve ficar **apenas no Apex**; o front envia ambos os sinais (`referralToken`, `lojaIndicadora`, `cepclient` / `ceplead`) e metadados de campanha.

## Payload JSON (`lead`)

Campos enviados (objeto plano; sem `owner`; sem `telDisplay`):

- Identificação / pessoa: `name`, `lastname`, `firstName`, `lastName`, `responsibleName`, `isOwner`, `email`, `tel`
- Endereço obra: `cepclient`, `ceplead` (espelho do CEP no submit)
- Consentimentos (string `"true"` / `"false"`): `privacyPolicy`, `marketingConsent`
- Lead / registro: `idLead` (composto no front a partir de nome + telefone), `recordtypeDevName`, `company`, `company2`, `canalDeEntrada`
- Indicação e UTM: `storeRef`, `referralToken`, `lojaIndicadora`, `lojaSugerida`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`
- Origem: `origemLead`, `campanha`, `tipoLead`, `canal`, `pageUrl`, `dataHoraCadastro`
- Guia: `nameGuideShop` vem só de `lojaSugerida` no submit; **não** repetir o token de indicação em `nameGuideShop` — o Apex resolve `referralToken` / `lojaIndicadora` para a Guide Shop real.
- Fotos: `photos` — array de **metadados** apenas (`name`, `size`, `type`, `lastModified` por arquivo). Nenhum binário no JSON.

**OwnerId:** não é enviado pelo front; **TODO Salesforce:** atribuir Owner / fila no Apex conforme política do Cadastro Sua Obra.

## Retorno de `upsertLead` (interpretação no LWC)

Até haver contrato oficial, o componente trata:

- `null` / string vazia: sucesso sem Id explícito.
- String que pareça Id Salesforce (15–18 caracteres alfanuméricos): sucesso com `leadId` = essa string.
- Objeto: lê opcionalmente `success`, `leadId` ou `id`, `guideShopName`; se `success === false`, trata como falha de negócio sem avançar etapa nem disparar dataLayer.

**TODO Salesforce:** documentar e implementar retorno único (ex.: `{ success, leadId, message, guideShopName }`) no método definitivo.

## Erros

- Falha de rede ou exceção Apex: mensagem amigável na etapa 2; tentativa-se extrair `body.message` ou `body.pageErrors[].message` quando existir.
- Não há push no `dataLayer` em caso de erro.

## Upload de arquivos após o Lead

Após sucesso, se houver fotos selecionadas **e** `leadId` retornado, o LWC chama um stub que hoje não envia arquivos.

**TODO Salesforce:** definir canal (ContentVersion ligado ao Lead, API dedicada, Experience Cloud Guest, limites de tamanho/quantidade) e substituir o stub sem colocar base64 no mesmo JSON do `upsertLead`.

## Gestão de muitas lojas (400+ links / parâmetros)

- Parametrização de URLs (`ref`, `storeRef`) e consistência com registros de loja/franquia no Salesforce deve ser validada pelo time (listas, redirects, Experience Cloud).
- Relatórios e governança de campanhas com muitas variantes de URL ficam como responsabilidade CRM/analytics, não do LWC.

## Checklist de validação com o time

1. Campos extras no JSON (`referralToken`, `responsibleName`, `isOwner`, etc.) são aceitos ou ignorados pelo `LpSejaUmFranqueadoService.upsertLead` sem erro?
2. Formato real de retorno e mapeamento para `leadId` e nome da loja guia.
3. Regra de prevalência token vs CEP e atribuição de Owner/fila.
4. Permissões Guest User / comunidade para `upsertLead` e para upload futuro.
5. Planejar `LpObraService` (ou equivalente) e migração do gateway no LWC.
