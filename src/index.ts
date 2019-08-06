import SecurityGroup from './SecurityGroup';
import { ScalewayZone } from './library/interfaces/Scaleway';

require('dotenv-defaults').config();

/**
 * Validate that all required environment variables are set.
 */
function validateEnvironmentVariables() {
    const requiredEnv = ['AUTH_TOKEN', 'MASTER_ID', 'MASTER_ZONE', 'TARGET_GROUPS_JSON'];

    requiredEnv.forEach((variable) => {
        if (!process.env[variable]) {
            throw Error(`Missing environment variable! See .env.defaults [Missing: ${variable}]`)
        }
    });
}

function targets(): Promise<SecurityGroup>[] {
    const targets = require(`../${process.env.TARGET_GROUPS_JSON}`);
    return targets.map((target: { id: string, zone: ScalewayZone }) => {
        return SecurityGroup.get(target.zone, target.id);
    });
}

/**
 * Current master group.
 */
async function syncGroups() {
    const primaryGroup = await SecurityGroup.get(<ScalewayZone>process.env.MASTER_ZONE, process.env.MASTER_ID!);
    const primaryRules = await primaryGroup.editableRules;
    const targetGroups = await Promise.all(targets());

    await Promise.all(targetGroups.map(async (group) => {
        await group.clearRules();
        await group.addRules(primaryRules);
    }))
}

validateEnvironmentVariables();
syncGroups().then(() => {
    console.info('Successfully synchronized groups!');
}).catch((error) => {
    console.error('Encountered error syncing groups!');
    console.error(error);
});