declare module 'react-gtm-module' {
  interface TagManagerArgs {
    gtmId: string;
    dataLayer?: Record<string, any>;
    dataLayerName?: string;
    auth?: string;
    preview?: string;
  }

  interface DataLayerArgs {
    dataLayer: Record<string, any>;
  }

  const TagManager: {
    initialize: (args: TagManagerArgs) => void;
    dataLayer: (args: DataLayerArgs) => void;
  };

  export default TagManager;
}

