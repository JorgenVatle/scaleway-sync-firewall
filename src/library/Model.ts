import FirewallRuleInterface from './interfaces/FirewallRuleInterface';
import SecurityGroupInterface from './interfaces/SecurityGroupInterface';
import Axios, { AxiosInstance } from 'axios';

/**
 * Possible document types.
 */
type ModelDocument = FirewallRuleInterface | SecurityGroupInterface;

/**
 * Scaleway Zone.
 */
type ScalewayZone = 'par-1' | 'ams-1';

/**
 * Abstract Model foundation class.
 */
abstract class Model<T extends ModelDocument> {

    /**
     * Axios client for this Model instance.
     */
    protected static client(zone: ScalewayZone) {
        return Axios.create({
            baseURL: `https://cp-${zone}.scaleway.com/${this.path.replace(/^\/+|\/$/, '')}`,
            headers: {
                'X-Auth-Token': process.env.AUTH_TOKEN,
            }
        })
    };

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
    public static get(zone: ScalewayZone, id: string) {
        return this.client(zone).get(id).then(({ data }) => data);
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
