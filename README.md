# website-backend
The backend for the website of ÆSIR

Requires a file called `configuration.json` in the repository root with the following contents:
```json
{
  "slack": {
    "recruitment": {
      "webhookURL": "slack webhook URL for posting to a recruitment channel"
    }
  }
}
```