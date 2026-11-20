// Combine cloud rows with this browser's rows. The cloud wins when both have the same id.
// Returns everything, plus the rows that exist only here and still need uploading.
export function mergeById(cloud, local) {
  const ids = new Set(cloud.map((x) => x.id))
  const localOnly = local.filter((x) => !ids.has(x.id))
  return { merged: [...cloud, ...localOnly], localOnly }
}
