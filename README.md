## Getting Started

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
