\# MaterialMatch AI ♻️



\## AI-Assisted Industrial Waste Exchange Marketplace



MaterialMatch AI is a mobile application that connects industries generating reusable waste with industries that need those materials. It helps users discover materials, compare suppliers, and request exchanges to encourage industrial waste reuse and a circular economy.



\## Features



\- \*\*User Registration and Login:\*\* Industry users can register and securely access the application.

\- \*\*Industry Management:\*\* View industry information.

\- \*\*List Your Waste:\*\* Add reusable materials with category, quantity, unit, location, and quality details.

\- \*\*Find Materials:\*\* Search available materials and view supplier information.

\- \*\*Requirements:\*\* Specify the materials and quantities an industry needs.

\- \*\*Exchange Requests:\*\* Request materials from suppliers and track exchange status.

\- \*\*Multi-Supplier Matching:\*\* Find potential material matches across multiple suppliers.

\- \*\*Resource Loop:\*\* Explore the reuse of resources across industries.

\- \*\*Cloud Backend:\*\* Connect to a deployed Spring Boot backend and MongoDB database.



\## Technology Stack



| Component | Technology |

|---|---|

| Mobile App | React Native |

| Framework | Expo |

| Navigation | Expo Router |

| Backend | Java, Spring Boot |

| API | REST API |

| Database | MongoDB Atlas |

| Authentication | JWT |

| Backend Hosting | Render |

| Android Builds | Expo Application Services (EAS) |

| Version Control | Git, GitHub |



\## System Architecture



```text

Industry User

&#x20;    |

&#x20;    v

React Native + Expo Mobile App

&#x20;    |

&#x20;    | REST API

&#x20;    v

Spring Boot Backend

&#x20;    |

&#x20;    v

MongoDB Atlas

```



The mobile application sends requests to the Spring Boot backend. The backend processes authentication, industry information, material listings, requirements, and exchange-related operations using the database.



\## Project Links



\- \*\*GitHub Source Code:\*\* https://github.com/UvaSaraSri-2005/PROJECT-MaterialMatchAI

\- \*\*Android APK Download:\*\* https://expo.dev/artifacts/eas/zF5qyAB4P-xW07o1Uu9w6LzwD6vx2YazL4zoBkpoH8M.apk

\- \*\*Backend URL:\*\* https://materialmatch-ai-backend.onrender.com

\- \*\*Industries API:\*\* https://materialmatch-ai-backend.onrender.com/api/industries



> The APK link provides an Android installation package. It is not a Google Play Store listing.



\## Local Setup



\### Prerequisites



\- Git

\- Java and Maven

\- Node.js and npm

\- MongoDB Atlas or another compatible MongoDB instance



\### 1. Clone the Repository



```bash

git clone https://github.com/UvaSaraSri-2005/PROJECT-MaterialMatchAI.git

cd PROJECT-MaterialMatchAI

```



\### 2. Run the Backend



```bash

cd backend

```



Configure the `MONGODB\_URI` environment variable with your own MongoDB connection string.



PowerShell example:



```powershell

$env:MONGODB\_URI = "YOUR\_MONGODB\_CONNECTION\_STRING"

```



Start the backend:



```bash

mvn spring-boot:run

```



The local backend normally runs at `http://localhost:8080`, unless configured otherwise.



\### 3. Run the Mobile App



Open a separate terminal:



```bash

cd mobile-app

npm install

npx expo start

```



Configure the app to use your backend URL. For local testing on a physical phone, use a reachable computer LAN IP instead of `localhost`.



\### 4. Build an Android APK



After configuring and logging in to Expo Application Services:



```bash

npx eas-cli build --platform android --profile preview

```



Download the APK from the completed EAS build page.



\## Security



\- Never commit MongoDB credentials or JWT secrets.

\- Keep private environment variables out of GitHub.

\- Use deployment environment settings for production secrets.

\- Do not publish sensitive user information.



\## Expected Impact



\- Encourage industrial waste reuse.

\- Help industries discover potential material suppliers.

\- Improve resource utilization.

\- Support circular economy practices.

\- Help users compare materials based on availability, location, and quality.



\## Future Enhancements



\- Improved AI-based material compatibility recommendations.

\- Advanced supplier ranking and logistics optimization.

\- Environmental impact estimation.

\- Exchange notifications.

\- Google Play Store release after production readiness checks.



\## Project Status



The Android APK has been built, installed, and tested. Core flows include authentication, material discovery, exchange requests, requirements, and the Resource Loop screen.



\## License



Add an appropriate open-source license before allowing others to reuse or redistribute this project.



