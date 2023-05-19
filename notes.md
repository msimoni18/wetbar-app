Consider separating Plot and Accordion inputs into two
separate components. That way when the accordion is updated,
typing should hopefully speed up.



Use memo for file list showing found files
after dry run
```{javascript}
import {memo} from 'react'

export default memo(SimpleFileContainer)
```

or use useMemo for file list provided to
SimpleFileContainer <-- This is possibly better



Use useCallback for functions that get used
in useFetch, but only need to be created on mount.
Will this function get created when the component
it is in re-renders, or does it only get created
on the initial mount? Take a look at github repo
to find example from video.



Consider useTransition for label inputs in
PlotContainer