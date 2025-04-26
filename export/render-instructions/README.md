# Deploying GMG Underground on Render

Follow these steps to deploy your application on Render:

## Step 1: Create a Render Account
Sign up at https://render.com if you don't already have an account.

## Step 2: Create a New Web Service
1. Go to the Render dashboard
2. Click "New +" button and select "Blueprint"
3. Connect your GitHub/GitLab account and select the repository where you've uploaded this code
4. Render will detect the `render.yaml` file and propose creating the services defined in it
5. Click "Apply" to proceed

## Step 3: Configure Environment Variables
The `render.yaml` file already includes the necessary configuration to link the web service with the PostgreSQL database.

## Step 4: Deploy
Render will automatically build and deploy your application. The build process may take a few minutes.

## Step 5: Access Your Application
Once deployment is complete, you can access your application at the URL provided by Render.

## Additional Notes
- The database will be automatically provisioned based on the `render.yaml` configuration
- Render will automatically handle SSL/TLS certificates for your domain
- For custom domains, you can configure them in the Render dashboard
