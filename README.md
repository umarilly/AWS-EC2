# AWS-EC2

The AWS EC2 (Elastic Compute Cloud) project demonstrates how to deploy a Node.js backend (Express) on an AWS EC2 instance. This guide covers setting up an EC2 instance, configuring security groups, and deploying a simple Express.js application.

This guide provides three main parts:
1. **Basic Practice**: A quick guide to set up an AWS account, create an EC2 instance, and interact with it using the `connect browser option`.
2. **Application Practice**: Step-by-step guide on how to create a Node.js application and deploy it on an EC2 instance and get access using `ssh`.
3. **Using Process Manager - PM2**: Learn to manage your Node.js application with PM2 for better performance and reliability.
4. **Local Development and Remote Deployment**: Instructions on developing your application locally and deploying it to EC2 using `scp` or `git`.

---

## AWS EC2 - (Elastic Compute Cloud):
- One of the most popular services of AWS
- Comes under the category of compute service
- Server-based (non-serverless)
- Provides secure and resizable compute capacity
- Provides scaling - Instances can scale up and down - Pay for what you use
- Can be integrated with other services, operate from any region, and also provides multiple OS options
- Also works with Amazon VPC for secure network resources

## Basic AWS EC2 Practice

### 1. Create an AWS Account
- Go to [AWS](https://aws.amazon.com/) and create a free account if you haven't done so already.

### 2. Create an IAM User
- Log into your AWS account.
- Go to **IAM** (Identity and Access Management).
- Create a new user and assign **Programmatic Access**.
- Attach the policy **AmazonEC2FullAccess** (or use more granular permissions based on your needs).
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
- Default region name (e.g., us-east-1)
- Default output format (optional, e.g., json)

### 6. Create and Launch an EC2 Instance
**Launch an EC2 instance using AWS Management Console:**
- Go to the EC2 dashboard.
- Click "Launch Instance".
- Choose an Amazon Machine Image (AMI). For example, choose the latest Amazon Linux or Ubuntu AMI.
- Select an instance type (e.g., t2.micro which is free-tier eligible).
- Create or use an existing key pair to access your instance.
- Create a security group.
- Launch the instance.
- Connect using the browser - a new Ubuntu CLI will open, and you can start working.

### 7. Map a Static IP (Optional)
- As the provided IP is dynamic
- Go to Elastic IP, create one, and associate it with the instance
- Tips: When you create a static IP (Elastic IP), ensure it is associated with an EC2 instance. AWS charges for idle Elastic IPs that are not associated with any running instance. To avoid unnecessary charges, release the Elastic IP if it is no longer needed or ensure it is always connected to an EC2 instance.

## Application Practice

- Backend: Node.js + Express.js
- Cloud Service: AWS EC2 + Elastic IP

### 1. Create AWS EC2 Instance

**Create EC2 Instance Using AWS Management Console**
- Follow the same steps as above to create an EC2 instance.
- The only difference is, we will use SSH in this practice to connect to the instance.

**Create EC2 Instance Using CLI**
- Use the following command:

```bash
aws ec2 run-instances --image-id ami-0abcdef1234567890 --count 1 --instance-type t2.micro --key-name practice-key-01.pem
```

- Replace ami-0abcdef1234567890 with the correct AMI ID.
- Create or use an existing key pair to access your instance. (Download it)
- Configure the security group: Add a rule to allow inbound traffic on port 22 (SSH) and port 3000 (for your Node.js app).

### 2. Access through SSH
- Go to the directory where your key is present and type the following to give executable permission to the file:

```bash
chmod 400 "MyKeyPair.pem"
```

```bash
chmod 400 practice-key-01.pem
```

- Note: `practice-key-01.pem` is the name of my `MyKeyPair.pem` file.

- Enter the following command to get into Your EC2 Instance using SSH:

```bash
ssh -i "MyKeyPair.pem" ec2-user@<your-ec2-instance-public-ip> 
```

```bash
ssh -i "practice-key-01.pem" ubuntu@ec2-107-22-229-30.compute-1.amazonaws.com
```

- Enter `exit` to exit the EC2 instance terminal and get back to your local machine terminal.

- Stop, Close and Cleaning up your instance
 - You can close using the AWS management console - (dashboard)
 - Or you can also close using AWS-CLI

    ```bash
    aws ec2 stop-instances --instance-ids <your-instance-id>
    ```

### 3. Install dependencies and set up your application

- Install Node.js and npm in your EC2 instance:
    - `sudo apt update -y` (apt or yum, depends on Linux distribution)
    - Install Node Version Manager - nvm (best approach)
    - You can also install Node.js and npm separately (if not installing nvm)
- `npm init -y`
- `npm install express`
- `touch server.js`
- `vim server.js`
- Add your code, e.g., you can check from the example below:

        ```bash
        const express = require('express');
        const app = express();

        const PORT = 3000;

        app.get('/', (req, res) => {
            res.send('Hello, World from EC2');
        });

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
        ```

### 4. Run your Node.js server inside the EC2 Instance
- Go to the root directory of your application.
- Run `node server.js`.
- Ensure your EC2 instance's security group allows inbound traffic on port 3000.


## Using Process Manager - PM2

- Manage your Node.js application with PM2 for better performance and reliability.

### 1. Install PM2

- If Node.js is installed, simply use:
 - `sudo npm install -g pm2`

- `Optional`
> When installing Node.js using nvm, sometimes Node.js isn't available globally for sudo. You can fix this by creating a symbolic link:
> - `sudo ln -s $(which node) /usr/bin/node`
>
> If you still need to run the command with sudo, make sure you're pointing to the correct npm path by running:
> - `sudo $(which npm) install -g pm2`

As we have installed Node.js using nvm, we will not use sudo to install pm2:
- `npm install -g pm2`
- `pm2 --version`

### 2. Start your application using PM2
- `pm2 start server.js`
- If you want your app to auto start on reboot:
    - `pm2 startup`
    - `pm2 save`
- To check the logs:
    - `pm2 logs`

### 3. Manage PM2 Processes

- View the list of all processes:
    ```bash
    pm2 list
    ```
- Find the ID of the process you want to manage.
- Stop a specific app:
    ```bash
    pm2 stop <app-id>
    ```
- Stop all apps:
    ```bash
    pm2 stop all
    ```
- Restart a specific app:
    ```bash
    pm2 restart <app-id>
    ```
- Delete a specific app:
    ```bash
    pm2 delete <app-id>
    ```

## Local Development and Remote Deployment

- Instructions on developing your application locally and deploying it to EC2 using `scp` or `git`.
- Follow the same process for creating and running your application locally as described in the previous sections.

### 1. Deploying Your Application to EC2 Using SCP

You can deploy your application to an EC2 instance using either SCP (Secure Copy Protocol) or Git.

- On your local machine, ensure your key file has the correct permissions:

    ```bash
    chmod 400 practice-key-01.pem
    ```

- Make sure the key file is in the same directory as your application.

- Use the following command to copy your application to the EC2 instance:

    ```bash
    scp -i "MyKeyPair.pem" -r * ec2-user@<your-ec2-instance-public-ip>:~/directory
    ```

    ```bash
    scp -i "practice-key-01.pem" -r * ubuntu@ec2-107-22-229-30.compute-1.amazonaws.com:~/
    ```

    Note: You can use `*`, `.`, or `./` depending on which works for you.

- Once copied, use the same `ssh` command to connect to the EC2 instance and start your application remotely.

#### 2. Deploying Your Application to EC2 Using Git

- Clone your repository on the EC2 instance:

    ```bash
    git clone <your-repository-url>
    ```

- Navigate to your project directory and install dependencies:

    ```bash
    cd <your-project-directory>
    npm install
    ```

- Start your application:

    ```bash
    node server.js
    ```

### Pro Tips

If you don't want to use SCP or Git, consider the following alternatives:

- **Docker**: Containerize your application for easier deployment.
- **Git Branching and Hooks**: Use Git hooks like `post-receive` on the EC2 instance to automate deployment.
- **CI/CD Pipeline Tools**: Use tools like GitHub Actions, CircleCI, or Travis CI to automate the deployment process.
- **Deployment Services**: Use services like Capistrano or Ansible to automate the deployment process.


This `README.md` provides an easy-to-follow guide for setting up AWS CLI, interacting with EC2, and deploying a Node.js application.