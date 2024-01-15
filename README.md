## Hướng dẫn
- Before you begin
  1. [Select or create a Cloud Platform project.](https://console.cloud.google.com/project)
  2. [Enable billing for your project.](https://support.google.com/cloud/answer/6293499#enable-billing)
  3. [Enable the Cloud Translation API.](https://console.cloud.google.com/flows/enableapi?apiid=translate.googleapis.com)
  4. [Set up authentication with a service account](https://cloud.google.com/docs/authentication/getting-started) so you can access the API from your local workstation.
  5. [Get API key for your project](https://console.cloud.google.com/apis/credentials)
  6. Set API key to 'GGC_KEY_TRANSLATE' from .env.development 
  7. Source Language ~> [api/locales/source/en.json]()
  8. Target Language ~> [api/locales/target/**]() || PHP Language -> [api/locales/target_php/**]()
  9. Setup to ~> [api/src/language/language.service.ts]()
  10. Run yarn && yarn dev
