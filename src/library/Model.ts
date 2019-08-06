import Axios, { AxiosInstance } from 'axios';
import { Metadata, ModelDocument, ScalewayZone } from './interfaces/Scaleway';

function baseUrl(zone: ScalewayZone, ...to: string[]) {
    const path = to.join('/').replace(/\/{2,}/, '/');

    return `https://cp-${zone}.scaleway.com/${path.replace(/^\/+|\/$/, '')}`;
}

/**
 * Abstract Model foundation class.
 */
class Model<T extends ModelDocument> {

    /**
     * Fetch the given resource by path.
     */
    public static find(zone: ScalewayZone, id: string) {
        return this.client(zone).get(id).then(({ data }) => data);
    }

    /**
     * Fetch a single resource by ID.
     */
    // @ts-ignore
    public static get<T>(this: T, zone: ScalewayZone, id: string): Promise<InstanceType<T>> {
        // @ts-ignore
        return this.find(zone, id).then((response) => new this(response[this.subKey], zone));
    }

    /**
     * Axios client for this Model.
     */
    protected static client(zone: ScalewayZone) {
        return Axios.create({
            baseURL: baseUrl(zone, this.path),
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
     * Sub-response key for this model.
     * Responses include the key name of the model instead of just the model data.
     */
    public static readonly subKey: string;

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
        // @ts-ignore
        client.defaults.baseURL = baseUrl(this.zone, this.constructor.path, this.path!);

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
        delete this.entry.id;
        return this.client.post('/', this.entry);
    }

    /**
     * Register a has-many relationship between the current and given model.
     */
    protected hasMany<T extends typeof Model>(model: T, zone: ScalewayZone, path: string, meta?: Metadata): Promise<Array<InstanceType<T>>> {
        return model.find(zone, path).then((documents) => {
            return documents[model.subKey].map((document: any) => new model(document, zone, meta));
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
