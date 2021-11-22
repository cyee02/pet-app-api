# Graphql backend hosted on AWS ec2 instance

This project uses nodejs v16.13.0 and graphql as the backend server.
It assumes that you have already have an AWS account with an API call enabled user, and nodejs >v14 installed
('your user'/.aws/credentials should contain your api keys to AWS)

## Setup for local testing

1. Create a .env file in /pet-app-api/src/.env, then paste this inside your file. This key is used for your user login.
```
JWT_SECRET=someRandomSecretKey
```

2. Run ```npm install```

3. Run ```npm run setup```

3. Runs the app in the development mode.\
```npm run dev``` to serve on port 4000\
Open [http://localhost:4000](http://localhost:4000) to view it in the browser.\
The page will reload if you make edits.\
You will also see any lint errors in the console.

## AWS deployment
1. On AWS, create VPC, subnet, internet gateway.

2. Associate the internet gateway to the subnet.

3. Edit subnet route table to allow 0.0.0.0/0 internet gateway.

4. Go to pet-app-api/cfn-template/template.yml and edit VpcId, SubnetId and select an Ubuntu AMI (copy ID from AWS when creating an ec2 instance)

5. In your cloned repository, run ```npm run deploy```

6. SSH into instance, create the same .env file in pet-app-api

## Available GraphQL API calls (to be updated)
### Queries
### Mutations
### Subscriptions

## Sample API call. (Can use Insomnia/ Postman)
### To be updated
