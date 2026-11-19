const fragments = import.meta.glob<string>('@assets/empty-states/*.png', {
  eager: true,
  import: 'default',
  query: '?url',
})

export const EMPTY_STATE_FRAGMENTS = Object.entries(fragments).map(([path, src]) => ({ path, src }))
export const EMPTY_STATE_CELL_IMAGE = EMPTY_STATE_FRAGMENTS.find(({ path }) => path.endsWith('/Cell.png'))?.src
