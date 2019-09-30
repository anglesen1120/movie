import { getManager, Repository } from "typeorm";
import { Logger, ILogger } from "../utils/logger";

// Import Entities
import { Comment } from "../entities/Comment";
import { Movie } from "../entities/Movie";

export class CommentsService {
  private _commentRepository: Repository<Comment>;
  private _movieRepository: Repository<Movie>;
  private _logger: ILogger;

  constructor() {
    this._logger = new Logger(__filename);
    this._commentRepository = getManager().getRepository(Comment);
    this._movieRepository = getManager().getRepository(Movie);
  }

  public instantiate = (data: Object): Comment | undefined => {
    this._logger.info("Create a instantiate of Comment: ", data);

    return this._commentRepository.create(data);
  };

  public insert = async (data: Comment): Promise<Comment> => {
    this._logger.info("Create a new comment: ", data);

    const newComment = this._commentRepository.create(data);
    return await this._commentRepository.save(newComment);
  };

  public getAll = async (limit: number, offset: number): Promise<Comment[]> => {
    this._logger.info(
      `Get all comments with params: limit: ${limit}, offset: ${offset}`
    );

    return await this._commentRepository
      .createQueryBuilder("comment")
      .offset(offset)
      .limit(limit)
      .getRawMany();
  };

  public renameJson = async (json: any) => {
    return Object.keys(json).reduce(
      (s, item) =>
        item == "movieId"
          ? { ...s, ["movie"]: json[item] }
          : { ...s, [item]: json[item] },
      {}
    );
  };
}
