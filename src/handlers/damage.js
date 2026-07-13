export function getDamageStatus(raceState) {
    const player = raceState.getPlayerCar();
    if (!player?.status) return "No damage data yet.";

    const { frontLeftWingDamage, frontRightWingDamage, rearWingDamage, engineDamage, gearBoxDamage } = player.status;
    const issues = [];

    if (frontLeftWingDamage > 0 || frontRightWingDamage > 0) {
        issues.push(`front wing damage at ${Math.max(frontLeftWingDamage, frontRightWingDamage)} percent`);
    }
    if (rearWingDamage > 0) issues.push(`rear wing damage at ${rearWingDamage} percent`);
    if (engineDamage > 0) issues.push(`engine damage at ${engineDamage} percent`);
    if (gearBoxDamage > 0) issues.push(`gearbox damage at ${gearBoxDamage} percent`);

    if (issues.length === 0) return "Car is undamaged.";
    return `Damage report: ${issues.join(', ')}.`;
}