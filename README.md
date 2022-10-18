## Take Home Task
You are tasked to build a wallet tracking dashboard, which will display a list of transactions that are related to a certain wallet. Here are some of the requirements of the task.

### Must Have Requirements
The user should be able to request transaction data for multiple different wallets.
The user should be able to view data of the different wallets on the same view.
This could be a list view as an example.
The user should be able to see easily if this is an incoming or outgoing transaction.
The user should be able to share the link to another - so they get the same result.
The user should be able to add extra wallets or remove.

### Nice to have
These are not must-have requirements, but if you feel like you are enjoying the project and would like to add more, please feel free to tackle the tasks below, or even come up with your own ideas!

User is able to switch between 2 different views (Graph / List).
Sometimes the API retrieves the data slowly, how can we improve this?
Statistics / Data that you may think is useful to display.
Automated tests (Unit / Integration / E2E).

### Resources
You will require some idea of how blockchain transactions look like, an example to see what they are like can be found here. https://ftmscan.com/address/0x0eab5ee60bf26fccfc24992314d029678063bd7e.

We don’t expect you to scrape the data manually, so please feel free to use any of the blockchain API services, to mention a few.

```bash
https://blockdaemon.com/
https://bitquery.io/
https://www.covalenthq.com/
```

### Deliverables
We will provide you with a private GitHub repo, where you can push your code to.
You have 5 days to complete the assignment. But please time box it to no more than 12 hours.
Please provide a README.md file, with instructions on how to run the project.

## How to run

First, is to install the dependencies:

```bash
npm install
# or
yarn install
```

Second, is to generate a localhost certificate that will enable the app to work on `HTTPS` connection.
This is a must needed step as [Covalent API only accepts requests over HTTPS](https://www.covalenthq.com/docs/api/#/0/0/USD/1)

```bash
npm run ssl:setup
# or
yarn run ssl:setup
```

And lastly, run the development server

```bash
npm run dev
# or
yarn dev
```

Open [https://saladscan.local:3000](https://saladscan.local:3000) with your browser to see the result.
