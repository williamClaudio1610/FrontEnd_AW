# Imagens da Clínica

Esta pasta contém as imagens utilizadas no site da clínica médica.

## Estrutura de Pastas

```
clinica/
├── hero/           # Imagens para o carousel principal
├── services/       # Imagens dos serviços médicos
├── doctors/        # Imagens dos médicos
├── facilities/     # Imagens das instalações
└── icons/          # Ícones médicos
```

## Tipos de Imagens

### Hero Images (Carousel)
- `hero-1.jpg` - Consultório médico moderno
- `hero-2.jpg` - Equipamentos médicos
- `hero-3.jpg` - Profissionais de saúde

### Services Images
- `consulta.jpg` - Consulta médica
- `exames.jpg` - Exames laboratoriais
- `vacinacao.jpg` - Serviço de vacinação
- `cardiologia.jpg` - Especialidade cardiologia
- `pediatria.jpg` - Especialidade pediatria
- `ginecologia.jpg` - Especialidade ginecologia

### Doctors Images
- `doctor-1.jpg` - Médico especialista
- `doctor-2.jpg` - Médica especialista
- `doctor-3.jpg` - Pediatra

### Facilities Images
- `recepcao.jpg` - Recepção da clínica
- `laboratorio.jpg` - Laboratório
- `consultorio.jpg` - Consultório

## Especificações

- **Formato**: JPG, PNG, WebP
- **Resolução**: Mínimo 800x600px
- **Tamanho**: Máximo 500KB por imagem
- **Qualidade**: Alta qualidade, profissionais

## Uso no Código

Para usar estas imagens no código Angular:

```typescript
// No componente
carouselImages: string[] = [
  '/images/clinica/hero/hero-1.jpg',
  '/images/clinica/hero/hero-2.jpg',
  '/images/clinica/hero/hero-3.jpg'
];
```

## Paleta de Cores

- **Primária**: #0EA5E9 (Verde-azulado)
- **Secundária**: #0284C7 (Azul profundo)
- **Acentos**: #22D3EE (Verde claro)
- **Fundo**: #F0F9FF (Azul muito claro) 