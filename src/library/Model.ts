import FirewallRuleInterface from './interfaces/FirewallRuleInterface';
import SecurityGroupInterface from './interfaces/SecurityGroupInterface';
import { AxiosInstance } from 'axios';

/**
 * Possible document types.
 */
type ModelDocument = FirewallRuleInterface | SecurityGroupInterface;

/**
 * Abstract Model foundation class.
 */
abstract class Model<T extends ModelDocument> {

    /**
     * Axios client for this Model instance.
     */
    protected static readonly client: AxiosInstance;

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

    /**
     * Fetch the given resource by path.
     */
    public static get(id: string) {
        return this.client.get(id).then(({ request }) => request);
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
