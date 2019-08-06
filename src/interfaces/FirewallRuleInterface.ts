export default interface FirewallRuleInterface {
    id?: string;
    action: 'drop' | 'accept';
    dest_port_form: number;
    dest_port_to: number | null;
    direction: 'inbound' | 'outbound';
    editable: boolean;
    position: number;
    protocol: 'TCP' | 'UDP' | 'ICMP';
    ip_range: string;
}