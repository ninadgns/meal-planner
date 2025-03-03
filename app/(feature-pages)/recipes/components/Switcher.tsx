import { Button } from "@/components/ui/button"
import { Grid, List } from 'lucide-react'

interface ViewSwitcherProps {
  view: 'grid' | 'table'
  onViewChange: (view: 'grid' | 'table') => void
}

export function ViewSwitcher({ view, onViewChange }: ViewSwitcherProps) {
  return (
    <div className="flex space-x-2 mb-4">
      <Button
        variant={view === 'grid' ? 'default' : 'outline'}
        size="icon"
        onClick={() => onViewChange('grid')}
      >
        <Grid className="h-4 w-4" />
      </Button>
      <Button
        variant={view === 'table' ? 'default' : 'outline'}
        size="icon"
        onClick={() => onViewChange('table')}
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  )
}
