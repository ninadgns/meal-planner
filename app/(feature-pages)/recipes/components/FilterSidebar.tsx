import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

const categories = ["Electronics", "Clothing", "Books", "Home & Garden"]
const brands = ["Apple", "Samsung", "Nike", "Adidas", "Amazon Basics"]
const priceRanges = ["Under $50", "$50 - $100", "$100 - $200", "Over $200"]

export default function FilterSidebar() {
  return (
    <Accordion type="multiple" className="w-full">
      <AccordionItem value="category">
        <AccordionTrigger>Category</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox id={`category-${category}`} />
                <Label htmlFor={`category-${category}`}>{category}</Label>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="brand">
        <AccordionTrigger>Brand</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2">
            {brands.map((brand) => (
              <div key={brand} className="flex items-center space-x-2">
                <Checkbox id={`brand-${brand}`} />
                <Label htmlFor={`brand-${brand}`}>{brand}</Label>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="price">
        <AccordionTrigger>Price Range</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2">
            {priceRanges.map((range) => (
              <div key={range} className="flex items-center space-x-2">
                <Checkbox id={`price-${range}`} />
                <Label htmlFor={`price-${range}`}>{range}</Label>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

