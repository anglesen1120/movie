import { getManager, Repository } from "typeorm";
import { Logger, ILogger } from "../utils/logger";

// Import Entities
import { Movie } from "../entities/Movie";

export class MoviesService {
  private _movieRepository: Repository<Movie>;
  private _logger: ILogger;

  constructor() {
    this._logger = new Logger(__filename);
    this._movieRepository = getManager().getRepository(Movie);
  }

  public instantiate = (data: Object): Movie | undefined => {
    this._logger.info("Create a instantiate of Movie: ", data);

    return this._movieRepository.create(data);
  };

  public insert = async (data: Movie): Promise<Movie> => {
    this._logger.info("Create a new Movie: ", data);

    const newMovie = this._movieRepository.create(data);
    return await this._movieRepository.save(newMovie);
  };

  public getAll = async (limit: number, offset: number): Promise<any[]> => {
    this._logger.info(
      `Get all movies with params: limit: ${limit}, offset: ${offset}`
    );

    return await this._movieRepository
      .createQueryBuilder("movie")
      .offset(offset)
      .limit(limit)
      .getRawMany();
  };

  public getById = async (id: string | number): Promise<Movie> => {
    this._logger.info("Fetching movie by id: ", id);

    if (id) {
      return await this._movieRepository.findOne(id);
    }
    return Promise.reject(false);
  };

  public getByTitle = async (title: string): Promise<Movie | undefined> => {
    this._logger.info("Get movie by title: ", title);

    const movie: Movie = await this._movieRepository.findOne({
      where: { title }
    });

    if (movie) return movie;
    return undefined;
  };
}
