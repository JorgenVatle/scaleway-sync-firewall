import PrepareModel from './library/Model';
import SecurityGroupInterface from './library/interfaces/SecurityGroupInterface';
import FirewallRule from './FirewallRule';

export default class SecurityGroup extends PrepareModel<SecurityGroupInterface>('/security_groups') {

    /**
     * A security group has many firewall rules.
     */
    public get rules(): Promise<FirewallRule[]> {
        // @ts-ignore
        return this.hasMany(FirewallRule, this.zone, `${this.entry.id}/rules`, 'rules');
    }

}