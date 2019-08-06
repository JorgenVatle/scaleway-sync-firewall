export default abstract class Model<T> {

    /**
     * Data entry.
     */
    entry: T;

    /**
     * Model constructor.
     */
    constructor(entry: T) {
        this.entry = entry;
    }

}