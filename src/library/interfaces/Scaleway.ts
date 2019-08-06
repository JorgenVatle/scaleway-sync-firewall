import FirewallRuleInterface from './FirewallRuleInterface';
import SecurityGroupInterface from './SecurityGroupInterface';

/**
 * Possible document types.
 */
export type ModelDocument = FirewallRuleInterface | SecurityGroupInterface;
/**
 * Scaleway Zone.
 */
export type ScalewayZone = 'par-1' | 'ams-1';
/**
 * Metadata.
 */
export type Metadata = { [key: string]: any };