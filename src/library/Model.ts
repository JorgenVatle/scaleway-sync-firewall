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
class Model<T extends ModelDocument> {

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
     * Scaleway region/zone.
     */
    public zone: ScalewayZone;

    /**
     * Model constructor.
     */
    constructor(entry: T, zone: ScalewayZone) {
        this.entry = entry;
        this.zone = zone;
    }

    /**
     * Fetch the given resource by path.
     */
    public static get(zone: ScalewayZone, id: string) {
        return this.client(zone).get(id).then(({ data }) => data);
    }

    /**
     * Register a has-many relationship between the current and given model.
     */
    protected hasMany<T extends typeof Model>(model: T, zone: ScalewayZone, path: string, subKey: string): Promise<Array<InstanceType<T>>> {
        return model.get(zone, path).then((documents) => documents[subKey].map((document: any) => new model(document, zone)))
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
