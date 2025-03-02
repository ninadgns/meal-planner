-- Sort recipes by nutritional values
SELECT title, calories_per_serving, protein_per_serving, carbs_per_serving, fat_per_serving
FROM recipes
ORDER BY calories_per_serving DESC;
 
-- Find recipes within specific calorie range using subquery
SELECT r.title, r.calories_per_serving
FROM recipes r
WHERE r.recipe_id IN (
    SELECT recipe_id 
    FROM recipes 
    WHERE calories_per_serving BETWEEN 300 AND 600
)
ORDER BY r.calories_per_serving;

-- Complex nested query with diet restrictions
SELECT r.title, r.calories_per_serving
FROM recipes r
WHERE r.recipe_id NOT IN (
    SELECT ri.recipe_id
    FROM recipe_ingredients ri
    WHERE ri.ingredient_id IN (
        SELECT ua.ingredient_id
        FROM user_allergies ua
        WHERE ua.user_id = 'USER123'
    )
);

-- Group recipes by calorie ranges with HAVING clause
SELECT 
    CASE 
        WHEN calories_per_serving <= 300 THEN 'Low Calorie'
        WHEN calories_per_serving <= 600 THEN 'Medium Calorie'
        ELSE 'High Calorie'
    END AS calorie_category,
    COUNT(*) as recipe_count,
    AVG(calories_per_serving) as avg_calories
FROM recipes
GROUP BY 
    CASE 
        WHEN calories_per_serving <= 300 THEN 'Low Calorie'
        WHEN calories_per_serving <= 600 THEN 'Medium Calorie'
        ELSE 'High Calorie'
    END
HAVING AVG(calories_per_serving) > 200;

-- Full outer join to show all recipes and their ingredients
SELECT r.title, i.name as ingredient_name, ri.quantity, ri.unit
FROM recipes r
FULL OUTER JOIN recipe_ingredients ri ON r.recipe_id = ri.recipe_id
FULL OUTER JOIN ingredients i ON ri.ingredient_id = i.ingredient_id;

-- Left outer join to find recipes without ingredients
SELECT r.title, COUNT(ri.ingredient_id) as ingredient_count
FROM recipes r
LEFT OUTER JOIN recipe_ingredients ri ON r.recipe_id = ri.recipe_id
GROUP BY r.title
HAVING COUNT(ri.ingredient_id) = 0;

-- Set operations to find high-protein, low-fat recipes
SELECT recipe_id, title
FROM recipes
WHERE protein_per_serving > 20
INTERSECT
SELECT recipe_id, title
FROM recipes
WHERE fat_per_serving < 10;

-- Create view for healthy recipes
CREATE VIEW healthy_recipes AS
SELECT r.*, 
    (r.protein_per_serving / r.calories_per_serving * 100) as protein_ratio
FROM recipes r
WHERE calories_per_serving < 500 
    AND protein_per_serving > 15
    AND fat_per_serving < 15;

-- Query using the view
SELECT title, protein_ratio
FROM healthy_recipes
WHERE protein_ratio > 20
ORDER BY protein_ratio DESC;





2. Join with USING: Find all recipes and their ingredients
SELECT r.title, i.name, ri.quantity, ri.unit
FROM recipes r
JOIN recipe_ingredients ri USING (recipe_id)
JOIN ingredients i USING (ingredient_id)
ORDER BY r.title; 


-- 5. Subquery with ALL: Find recipes with calories higher than all keto diet minimum requirements
SELECT title, calories_per_serving
FROM recipes
WHERE calories_per_serving > ALL (
    SELECT daily_calorie_min
    FROM diets
    WHERE diet_name = 'Keto Diet'
);

-- 8. String Operation: Find recipes with 'with' in their title
SELECT title
FROM recipes
WHERE LOWER(title) LIKE '%with%';

-- 9. Update Operation: Update calorie requirements for Diabetic Diet
UPDATE diets
SET daily_calorie_max = 2000.00
WHERE diet_name = 'Diabetic Diet';

-- 10. Delete Operation: Remove expired meal plans
DELETE FROM meal_plans
WHERE end_date < CURRENT_DATE;

-- Create a view for common recipe information
CREATE VIEW recipe_nutrition AS
SELECT r.title, r.calories_per_serving, r.protein_per_serving,
       STRING_AGG(i.name, ', ') as ingredients
FROM recipes r
JOIN recipe_ingredients ri ON r.recipe_id = ri.recipe_id
JOIN ingredients i ON ri.ingredient_id = i.ingredient_id
GROUP BY r.recipe_id, r.title, r.calories_per_serving, r.protein_per_serving;

-- Use the view in a query
SELECT *
FROM recipe_nutrition
WHERE calories_per_serving < 400
ORDER BY protein_per_serving DESC;


3. Query: Find safe recipes for a specific user (e.g., 'us001') by excluding recipes with allergen ingredients

-- Method 1: Using NOT EXISTS
SELECT DISTINCT r.recipe_id, r.title, r.calories_per_serving
FROM recipes r
WHERE NOT EXISTS (
    SELECT 1
    FROM recipe_ingredients ri
    JOIN user_allergies ua ON ri.ingredient_id = ua.ingredient_id
    WHERE ri.recipe_id = r.recipe_id 
    AND ua.user_id = 'us001'
)
--ORDER BY r.calories_per_serving;

Method-2 
SELECT r.title
FROM recipes r
WHERE NOT EXISTS (
    SELECT 1 FROM recipe_ingredients ri
    JOIN ingredients i USING (ingredient_id)
    JOIN user_allergies ua ON i.ingredient_id = ua.ingredient_id
    WHERE ua.user_id = 'us001' 
    AND ri.recipe_id = r.recipe_id
);


9. Query: Get user meal plan summary with nutritional totals
SELECT mp.name, 
       SUM(r.calories_per_serving * mpr.servings) as total_calories,
       STRING_AGG(DISTINCT r.title, ', ') as recipes
FROM meal_plans mp
JOIN meal_plan_recipes mpr USING (meal_plan_id)
JOIN recipes r USING (recipe_id)
GROUP BY mp.meal_plan_id, mp.name;


10. Query: Find compatible recipes for multiple diet restrictions
SELECT r.title 
FROM recipes r
WHERE r.recipe_id IN (
    SELECT recipe_id FROM recipe_ingredients ri1
    WHERE NOT EXISTS (
        SELECT 1 FROM diets_type_2 dt
        JOIN categories c USING (category_id)
        WHERE dt.diet_id IN ('d06', 'd07')
        AND ri1.ingredient_id IN (
            SELECT ingredient_id 
            FROM ingredients 
            WHERE category_id = c.category_id
        )
    )
);


11. Query: Analyze recipe ingredient distribution across categories
WITH ingredient_stats AS (
    SELECT c.category_name, 
           COUNT(DISTINCT ri.recipe_id) as recipes_using,
           COUNT(ri.ingredient_id) as total_usage
    FROM categories c
    LEFT JOIN ingredients i USING (category_id)
    LEFT JOIN recipe_ingredients ri USING (ingredient_id)
    GROUP BY c.category_id, c.category_name
)
SELECT * FROM ingredient_stats ORDER BY recipes_using DESC;


12. Query: Compare user meal plans against diet restrictions
SELECT 
    mp.name,
    CASE WHEN SUM(r.carbs_per_serving) > dt1.daily_carbs_max THEN 'Exceeds Carbs'
         WHEN SUM(r.fat_per_serving) > dt1.daily_fat_max THEN 'Exceeds Fat'
         ELSE 'Within Limits' END as compliance_status
FROM meal_plans mp
JOIN meal_plan_recipes mpr USING (meal_plan_id)
JOIN recipes r USING (recipe_id)
JOIN user_diets ud USING (user_id)
JOIN diets_type_1 dt1 USING (diet_id)
GROUP BY mp.meal_plan_id, mp.name, dt1.daily_carbs_max, dt1.daily_fat_max;


13. Query: Create view for recipe recommendations
CREATE VIEW recipe_recommendations AS
SELECT r.title, r.calories_per_serving,
       STRING_AGG(DISTINCT d.diet_name, ', ') as compatible_diets
FROM recipes r
CROSS JOIN diets d
WHERE NOT EXISTS (
    SELECT 1 FROM recipe_ingredients ri
    JOIN ingredients i USING (ingredient_id)
    WHERE ri.recipe_id = r.recipe_id
    AND i.category_id IN (
        SELECT category_id FROM diets_type_2 WHERE diet_id = d.diet_id
    )
)
GROUP BY r.recipe_id, r.title, r.calories_per_serving;


14. Query: Find users with conflicting diet and allergy patterns
SELECT u.full_name, d.diet_name, i.name as allergic_ingredient
FROM users u
JOIN user_diets ud USING (user_id)
JOIN diets d USING (diet_id)
JOIN user_allergies ua USING (user_id)
JOIN ingredients i USING (ingredient_id)
WHERE EXISTS (
    SELECT 1 FROM diets_type_1 dt1
    WHERE dt1.diet_id = d.diet_id
    AND i.category_id IN (
        SELECT category_id FROM diets_type_2 
        WHERE diet_id = d.diet_id
    )
);

15. Query: Generate weekly meal variety analysis
sql
Copy
WITH meal_variety AS (
    SELECT mp.user_id,
           COUNT(DISTINCT r.recipe_id) as unique_recipes,
           COUNT(DISTINCT i.category_id) as ingredient_categories
    FROM meal_plans mp
    JOIN meal_plan_recipes mpr USING (meal_plan_id)
    JOIN recipes r USING (recipe_id)
    JOIN recipe_ingredients ri USING (recipe_id)
    JOIN ingredients i USING (ingredient_id)
    WHERE mp.start_date >= CURRENT_DATE - INTERVAL '7 days'
    GROUP BY mp.user_id
)
SELECT u.full_name, mv.*
FROM meal_variety mv
JOIN users u USING (user_id)
ORDER BY unique_recipes DESC;