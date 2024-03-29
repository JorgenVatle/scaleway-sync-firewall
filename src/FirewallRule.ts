import PrepareModel from './library/Model';
import FirewallRuleInterface from './library/interfaces/FirewallRuleInterface';

export default class FirewallRule extends PrepareModel<FirewallRuleInterface>('/security_groups') {

    /**
     * Model response key.
     */
    public static readonly subKey = 'rules';

    /**
     * Firewall rule metadata.
     */
    protected meta!: {
        securityGroupId: string;
    };

    /**
     * Rule path.
     */
    protected get path() {
        return `${this.meta.securityGroupId}/rules/${this.entry.id}`;
    }

}
