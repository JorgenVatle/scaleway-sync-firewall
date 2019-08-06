export default interface SecurityGroupInterface {
    id?: string;
    name: string;
    description: string;
    creation_date: string;
    enable_default_security: boolean;
    inbound_default_policy: 'drop' | 'accept';
    organization: string;
    organization_default: boolean;
    stateful: boolean;
    servers: Array<{
        id: string;
        name: string;
    }>
}