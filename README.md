# AWS-EC2

The AWS EC2 (Elastic Compute Cloud) project demonstrates how to deploy a Node.js backend (Express) on an AWS EC2 instance. This guide covers setting up an EC2 instance, configuring security groups, and deploying a simple Express.js application.

This guide provides two main parts:
1. **Basic Practice**: A quick guide to set up an AWS account, create an EC2 instance, and interact with it using `connect brower option`.
2. **Application Practice**: Step-by-step guide on how to create a Node.js application, deploy it on an EC2 instance.
3. **Using Process Manager - PM2**: Learn to manage your Node.js application with PM2 for better performance and reliability.

---

## AWS EC2 - (Elastic compute cloud):
- One of the most popular service of AWS
- Comes under the category of compute service
- Server full or non-serverless
- Provides secure and resizable compute capacity
- Provides scaling - Instances can scale up and down - Pay for what you use
- Can be integrated with other services, operate from any region and also provides multiple OS
- Also works with Amazon VPC for secure network resources

## Basic AWS S3 Practice

### 1. Create an AWS Account
- Go to [AWS](https://aws.amazon.com/) and create a free account if you haven't done so already.

### 2. Create an IAM User
- Log into your AWS account.
- Go to **IAM** (Identity and Access Management).
- Create a new user and assign **Programmatic Access**.
- Attach the policy **AmazonS3FullAccess** (or use more granular permissions based on your needs).
- Save the **Access Key ID** and **Secret Access Key**.

### 3. Install AWS CLI
- Follow the official AWS documentation to [install AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html) for your operating system.

### 4. Verify AWS CLI Installation
- Run the following command to check if the AWS CLI is installed correctly:

```bash
aws --version 
```

### 5. Configure AWS CLI
- Configure the AWS CLI with your credentials and settings:

```bash
aws configure
```
You'll be prompted to enter:

- AWS Access Key ID
- AWS Secret Access Key
- Default region name (e.g., us-east-01)
- Default output format (optional, e.g., json)

### 6. Create and Launch an EC2 Instance
**Launch an EC2 instance using AWS Management Console:**
- Go to the EC2 dashboard.
- Click "Launch Instance".
- Choose an Amazon Machine Image (AMI). For example, choose the latest Amazon Linux or Ubuntu AMI.
- Select an instance type (e.g., t2.micro which is free-tier eligible) or (t2.nano) and more.
- Create or use an existing key pair to access your instance.
- Create security group
- Launch the instance.
- connect using browser - in new a ubuntu cli will open and you can start working

### 7. Map a Static IP (Optional)
- As, the provided IP is dynamic
- Go to elastic IP, create one and associate it with the instance
- Tips: When you create a static IP (Elastic IP), ensure it is associated with an EC2 instance. AWS charges for idle Elastic IPs that are not associated with any running instance. To avoid unnecessary charges, release the Elastic IP if it is no longer needed or ensure it is always connected to an EC2 instance.

## Application Practice

- Backend: Node.js + Express.js
- Cloud Service: AWS EC2 + Elastic IP

### 1. Create AWS EC2 Instance

**Create EC2 Instance Using AWS Management Console**
- Same above steps to create EC2 instance 
- The only difference is, we will use SSH in this practice to connect to the instance

**Create EC2 Instance Using CLI**
- Use the following command:

```bash
aws ec2 run-instances --image-id ami-0abcdef1234567890 --count 1 --instance-type t2.micro --key-name practice-key-01.pem
```

- Replace ami-0abcdef1234567890 with the correct AMI ID
- Create or use an existing key pair to access your instance. (Download it)
- Configure security group: Add a rule to allow inbound traffic on port 22 (SSH) and port 3000 (for your Node.js app).

- Go to the directory where you key is present - chmod 400 practice-key-01.pem
- SSH into Your EC2 Instance - ssh -i "MyKeyPair.pem" ec2-user@<your-ec2-instance-public-ip> - ssh -i "practice-key-01.pem" ubuntu@ec2-107-22-229-30.compute-1.amazonaws.com
- `exit` to stop

### 2. Create a Backend for S3 Interaction

- Create a server folder and use the following commands:

```bash
npm init -y
npm install express cors dotenv @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

### 3. Create a .env file

- Create a .env file in the root of server and paste the following inside it:

```bash
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=your-aws-region
S3_BUCKET_NAME=your-bucket-name
```

### 4. Create a Backend for S3 Interaction

- Create a client folder and use the following commands:

```bash
npm create vite@latest .
```

Then, choose the following:
- React
- TypeScript + SWC

&, after this just type these commands

```bash
npm install
npm run dev
```

### 6. Setup Policy for Pre-signed URLs

- Go to the permissions of the specified bucket and under `Bucket Policy`, enter the following:

```bash
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AllowGetObjectFromLocalhost",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::bucket-name/*", // Enter bucket name
            "Condition": {
                "StringLike": {
                    "aws:Referer": "http://localhost:5173/*" // Or your application link
                }
            }
        }
    ]
}
```
- Also check the `Block public access (bucket settings)` and `Cross-origin resource sharing (CORS)` of your S3 bucket


This `README.md` provides an easy-to-follow guide for setting up AWS CLI, interacting with S3, and building a React app with S3 file uploads via pre-signed URLs.