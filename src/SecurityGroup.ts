import PrepareModel from './library/Model';
import SecurityGroupInterface from './library/interfaces/SecurityGroupInterface';
import FirewallRule from './FirewallRule';

export default class SecurityGroup extends PrepareModel<SecurityGroupInterface>('/security_groups') {

    /**
     * Model response sub-key.
     */
   static subKey = 'security_group';

    /**
     * A security group has many firewall rules.
     */
    public get rules(): Promise<FirewallRule[]> {
        return this.hasMany(
            // @ts-ignore
            FirewallRule,
            this.zone,
            `${this.entry.id}/rules`,
            { securityGroupId: this.entry.id }
            );
    }

    /**
     * Clear all rules for the current security group.
     */
    public async clearRules() {
        const rules = await this.rules;

        return Promise.all(rules.map((rule) => {
            return rule.delete();
        }));
    }

    /**
     * Add a list of rules to the current security group.
     */
    public addRules(rules: FirewallRule[]) {
        return Promise.all(rules.map((rule) => {
            return new FirewallRule(rule.entry, this.zone, { securityGroupId: this.entry.id }).create();
        }));
    }

}