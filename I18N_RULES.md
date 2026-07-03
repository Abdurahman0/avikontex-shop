# I18N Rules

## Mandatory localization policy

1. All user-facing text must be stored only in:
- `src/locales/ru.json`
- `src/locales/uz.json`
- `src/locales/en.json`

2. Do not write visible text directly inside React components.
- Forbidden: hardcoded strings in `src/components/**` or `src/pages/**`
- Required: use `t('translation.key')` from `react-i18next`

3. When adding a new UI text:
- Add the same key to `ru.json`, `uz.json`, and `en.json`
- Then reference that key in code

4. Product/category/spec text must also come from localization JSON files.

5. Supported languages for this project are only:
- `ru`
- `uz`
- `en`
