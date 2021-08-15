function requireAll(requireContext: __WebpackModuleApi.RequireContext) {
  return requireContext.keys().map(requireContext);
}

requireAll(require.context('./', true, /^(?!.*(?:test.ts$)).*\.ts|.scss$/));
