# Scaleway-Sync-Firewall
> Synchronize your [Scaleway](https://www.scaleway.com) Security Group firewall rules with a list of "slave" security
> groups.

## Installation
```bash
# Clone the repository
git clone https://github.com/JorgenVatle/scaleway-sync-firewall.git

# Install dependencies
npm install
```

## Setup
To set up the application, copy the `.env.defaults` file to `.env` and add your API key as well as the ID and zone of
your master security group.

From there, you can create a list of targets (see [`targets.example.json`](targets.example.json)).

Once set up, run `node dist` to push all the rules from your "master" group to your "slave" groups.

## License
This repository is licensed under the ISC license.
 
Copyright (c) 2019, Jørgen Vatle.