import { Pipe, PipeTransform } from "@angular/core";
@Pipe({
  name: "filter"
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string, propName: string): any[] {
    if (!items) return [];
    if (!searchText) return items;
    searchText = searchText.toLowerCase();
    const resultArray = [];
    for (const item of items) {
      for (var key in item) {
        if (propName === "any") {
          if (
            item[key]
              .toString()
              .toLowerCase()
              .includes(searchText)
          ) {
            resultArray.push(item);
          }
        } else {
          if (
            item[propName]
              .toString()
              .toLowerCase()
              .includes(searchText)
          ) {
            resultArray.push(item);
          }
        }
      }
    }
    let unique_array = resultArray.filter(function(elem, index, self) {
      return index == self.indexOf(elem);
    });
    return unique_array;
  }
}
