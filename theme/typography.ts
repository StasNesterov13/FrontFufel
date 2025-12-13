const typography = {
  // 🔹 Основной заголовок (используется для экранов, крупных секций)
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    textAlign: 'center' as const,
    color: '#333',
  },

  // 🔹 Подзаголовок (для разделов внутри экрана)
  subtitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    textAlign: 'left' as const,
    color: '#444',
  },

  // 🔹 Обычный текст (по умолчанию)
  text: {
    fontSize: 16,
    fontWeight: '400' as const,
    color: '#333',
  },
} as const;

export default typography;
