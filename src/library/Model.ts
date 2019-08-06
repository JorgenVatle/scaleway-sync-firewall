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
 * Metadata.
 */
type Metadata = { [key: string]: any };

/**
 * Abstract Model foundation class.
 */
class Model<T extends ModelDocument> {

    /**
     * Axios client for this Model.
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
     * Axios client for this Model instance.
     */
    public get client(): AxiosInstance {
        // @ts-ignore
        return this.constructor.client(this.zone);
    }

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
     * Path for the current resource.
     */
    protected path?: string;

    /**
     * Model instance metadata.
     */
    protected meta: Metadata;

    /**
     * Model constructor.
     */
    constructor(entry: T, zone: ScalewayZone, meta?: Metadata) {
        this.entry = entry;
        this.zone = zone;
        this.meta = meta || {};
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
    protected hasMany<T extends typeof Model>(model: T, zone: ScalewayZone, path: string, subKey: string, meta?: Metadata): Promise<Array<InstanceType<T>>> {
        return model.get(zone, path).then((documents) => {
            return documents[subKey].map((document: any) => new model(document, zone, meta));
        });
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
