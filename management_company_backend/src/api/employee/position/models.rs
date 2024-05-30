use serde::Serialize;
use uuid::Uuid;

#[derive(Serialize)]
pub struct Position {
    pub id: Uuid,
    pub name: String,
    pub salary: String,
}

#[derive(Serialize)]
pub struct PositionList {
    pub positions: Vec<Position>,
}
