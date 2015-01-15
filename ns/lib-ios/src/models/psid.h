//
//  ^^=name$$Model.h
//

#import <Foundation/Foundation.h>

@interface ^^=name$$Model : NSObject

^^fields.forEach(function(f){$$
@property (nonatomic , copy) NSString * ^^=f.name$$; //^^=f.text$$

^^})$$

@end
