import PrepareModel from './library/Model';
import SecurityGroupInterface from './library/interfaces/SecurityGroupInterface';
import FirewallRule from './FirewallRule';

export default class SecurityGroup extends PrepareModel<SecurityGroupInterface>('/security_groups') {

    /**
     * A security group has many firewall rules.
     */
    public get rules(): Promise<FirewallRule[]> {
        return this.hasMany(
            // @ts-ignore
            FirewallRule,
            this.zone,
            `${this.entry.id}/rules`,
            'rules',
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

}