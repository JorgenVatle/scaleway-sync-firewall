import FirewallRuleInterface from './interfaces/FirewallRuleInterface';
import SecurityGroupInterface from './interfaces/SecurityGroupInterface';

/**
 * Possible document types.
 */
type ModelDocument = FirewallRuleInterface | SecurityGroupInterface;

/**
 * Abstract Model foundation class.
 */
abstract class Model<T extends ModelDocument> {

    /**
     * Model service path.
     */
    public static path: string;

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

/**
 * Prepare a Model class for the given service path.
 */
export default function <T extends ModelDocument>(baseServicePath: string) {
    abstract class PreparedModel extends Model<T> {
        public static path = baseServicePath;
    }

    return PreparedModel;
};
