import { awsVroomProcessor } from "./aws-vroom-processor";
import { OptimizationService } from "./optimization-processor";

const optimizationService = new OptimizationService(awsVroomProcessor);

export default optimizationService;
