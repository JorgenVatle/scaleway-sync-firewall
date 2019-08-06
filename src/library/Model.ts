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
     * Fetch the given resource by path.
     */
    public static get(zone: ScalewayZone, id: string) {
        return this.client(zone).get(id).then(({ data }) => data);
    }

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
     * Axios client for this Model instance.
     */
    public get client(): AxiosInstance {
        // @ts-ignore
        const client = this.constructor.client(this.zone);
        client.defaults.baseURL = this.path;

        return client;
    }

    /**
     * Model constructor.
     */
    constructor(entry: T, zone: ScalewayZone, meta?: Metadata) {
        this.entry = entry;
        this.zone = zone;
        this.meta = meta || {};
    }

    /**
     * Delete the current resource.
     */
    public delete() {
        return this.client.delete('/');
    }

    /**
     * Patch the current resource.
     */
    public patch(data: Partial<T>) {
        return this.client.put('/', {
            ...this.entry,
            ...data,
        });
    }

    /**
     * Create a new resource using the current model entry.
     */
    public create() {
        return this.client.post('/', this.entry);
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
