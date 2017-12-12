import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'includeSelected',
  pure:false
})
export class EventFilterPipe implements PipeTransform {
    transform(items: any[], filter: Object): any {
        if (!items || !filter) {
            return items;
        }
        // filter items array, items which match and return true will be kept, false will be filtered out
        return items.filter(item => item.Description !== null);
    }
}