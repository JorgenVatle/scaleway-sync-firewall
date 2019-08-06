import FirewallRuleInterface from './interfaces/FirewallRuleInterface';
import SecurityGroupInterface from './interfaces/SecurityGroupInterface';

/**
 * Possible document types.
 */
type ModelDocument = FirewallRuleInterface | SecurityGroupInterface;

export default abstract class Model<T extends ModelDocument> {

    /**
     * API service path for the current model.
     */
    protected abstract readonly path: string;

    /**
     * Data entry.
     */
    public entry: T;

    /**
     * Model constructor.
     */
    constructor(entry: T) {
        this.entry = entry;
    }

}