import RecipeCard from './RecipeCard';
import styled from 'styled-components';

const RecipeContainer = styled.section`
    padding: 30px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
`;

interface RecipeProps {
    id: string;
    title: string;
    image: string;
    time: string;
    level: string;
    rate: string;
    desc: string;
}
interface RecipeListProps {
    recipes: RecipeProps[];
}
export default function RecipeList({ recipes }: RecipeListProps) {
    return (
        <RecipeContainer>
            {/* 데이터 연동하면 ...recipe로 코드 변경 필요 */}
            {recipes.map((recipe: RecipeProps) => (
                <RecipeCard
                    key={recipe.id}
                    id={recipe.id}
                    title={recipe.title}
                    image={recipe.image}
                    time={recipe.time}
                    level={recipe.level}
                    rate={recipe.rate}
                    desc={recipe.desc}
                />
            ))}
        </RecipeContainer>
    );
}
